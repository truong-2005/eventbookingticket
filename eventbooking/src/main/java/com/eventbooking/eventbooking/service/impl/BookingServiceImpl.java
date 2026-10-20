package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.dto.booking.*;
import com.eventbooking.eventbooking.entity.*;
import com.eventbooking.eventbooking.enums.BookingStatus;
import com.eventbooking.eventbooking.enums.EventStatus;
import com.eventbooking.eventbooking.enums.PaymentStatus;
import com.eventbooking.eventbooking.exception.*;
import com.eventbooking.eventbooking.mapper.BookingMapper;
import com.eventbooking.eventbooking.repository.BookingRepository;
import com.eventbooking.eventbooking.repository.EventRepository;
import com.eventbooking.eventbooking.repository.UserRepository;
import com.eventbooking.eventbooking.service.BookingService;
import com.eventbooking.eventbooking.util.BookingCodeGenerator;
import com.eventbooking.eventbooking.util.DateTimeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.servlet.http.HttpServletRequest;
import com.eventbooking.eventbooking.enums.PaymentMethod;
import com.eventbooking.eventbooking.service.VNPayService;

@Slf4j
@Service
@Transactional(readOnly = true)
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;
    private final VNPayService vnPayService;

    public BookingServiceImpl(BookingRepository bookingRepository, EventRepository eventRepository, UserRepository userRepository, BookingMapper bookingMapper, VNPayService vnPayService) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.bookingMapper = bookingMapper;
        this.vnPayService = vnPayService;
    }

    // ===== ĐẶT VÉ (nguyên tử: khóa row event, trừ vé, sinh mã) =====
    @Override
    @Transactional
    public BookingResponse create(CreateBookingRequest request, HttpServletRequest httpRequest) {
        // Khóa bản ghi event để 2 request đồng thời không oversell
        Event event = eventRepository.findByIdForUpdate(request.eventId())
                .orElseThrow(() -> new ResourceNotFoundException("Sự kiện", "id", request.eventId()));

        User user = getCurrentUser();

        if (event.getStatus() != EventStatus.UPCOMING)
            throw new BookingException("Sự kiện không còn bán vé");
        if (DateTimeUtil.hasStarted(event.getEventDate()))
            throw new BookingException("Sự kiện đã bắt đầu, không thể đặt vé");
        if (request.quantity() == null || request.quantity() < 1)
            throw new BookingException("Số lượng vé phải lớn hơn 0");
        // Release reservations left behind by failed payments before checking stock or duplicates.
        var failedBookings = bookingRepository.findByUserIdAndEventIdAndStatusAndPaymentStatus(
                user.getId(), event.getId(), BookingStatus.CONFIRMED, PaymentStatus.FAILED);
        for (Booking failedBooking : failedBookings) {
            event.setAvailableTickets(Math.min(
                    event.getTotalTickets(),
                    event.getAvailableTickets() + failedBooking.getQuantity()));
            failedBooking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(failedBooking);
        }

        if (event.getAvailableTickets() < request.quantity())
            throw new BookingException("Không đủ vé, chỉ còn " + event.getAvailableTickets() + " vé");
        if (bookingRepository.existsByUserIdAndEventIdAndStatusAndPaymentStatusIn(
                user.getId(), event.getId(), BookingStatus.CONFIRMED, java.util.List.of(PaymentStatus.PENDING, PaymentStatus.PAID)))
            throw new BookingException("Bạn đã đặt vé cho sự kiện này rồi");

        // Sinh mã vé — lặp đến khi không trùng
        String bookingCode;
        do {
            bookingCode = BookingCodeGenerator.generate();
        } while (bookingRepository.existsByBookingCode(bookingCode));

        Booking booking = bookingMapper.toEntity(request, user, event, bookingCode);
        
        // If VNPAY is selected, set booking status as PENDING (or leave it CONFIRMED if we consider seat reserved)
        // Let's set it as PENDING for now, meaning they need to pay to confirm.
        // Or keep CONFIRMED but PaymentStatus is PENDING. We will just use what mapper does.
        booking.setStatus(BookingStatus.CONFIRMED);

        // Trừ vé
        event.setAvailableTickets(event.getAvailableTickets() - request.quantity());

        Booking saved = bookingRepository.save(booking);
        log.info("User {} đặt {} vé sự kiện {}", user.getUsername(), request.quantity(), event.getTitle());
        
        String paymentUrl = null;
        if (saved.getPaymentMethod() == PaymentMethod.VNPAY) {
            String orderInfo = "Thanh toan ve " + saved.getBookingCode();
            paymentUrl = vnPayService.createPaymentUrl(httpRequest, saved.getTotalAmount().longValue(), orderInfo, saved.getBookingCode());
        }

        return bookingMapper.toResponse(saved, paymentUrl);
    }

    @Override
    @Transactional
    public BookingResponse failPayment(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCodeForUpdate(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Vé", "bookingCode", bookingCode));

        if (booking.getPaymentStatus() == PaymentStatus.PAID
                || booking.getPaymentStatus() == PaymentStatus.REFUNDED) {
            return bookingMapper.toResponse(booking);
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            Event event = eventRepository.findByIdForUpdate(booking.getEvent().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sự kiện", "id", booking.getEvent().getId()));
            event.setAvailableTickets(Math.min(
                    event.getTotalTickets(),
                    event.getAvailableTickets() + booking.getQuantity()));
            booking.setStatus(BookingStatus.CANCELLED);
        }

        booking.setPaymentStatus(PaymentStatus.FAILED);
        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse findById(Long id) {
        return bookingMapper.toResponse(getBooking(id));
    }

    @Override
    public BookingResponse findByCode(String bookingCode) {
        return bookingMapper.toResponse(bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Vé", "bookingCode", bookingCode)));
    }

    @Override
    public Page<BookingResponse> getMyBookings(Pageable pageable) {
        return bookingRepository.findByUserId(getCurrentUser().getId(), pageable)
                .map(bookingMapper::toResponse);
    }

    @Override
    @Transactional
    public BookingResponse cancelMyBooking(Long id) {
        Booking booking = getBookingForUpdate(id);
        User currentUser = getCurrentUser();
        if (booking.getUser() == null || !booking.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Vé", "id", id);
        }
        return cancelBooking(booking);
    }

    @Override
    public Page<BookingResponse> findByEvent(Long eventId, Pageable pageable) {
        return bookingRepository.findByEventId(eventId, pageable).map(bookingMapper::toResponse);
    }

    @Override
    public Page<BookingResponse> findAll(BookingStatus status, Pageable pageable) {
        Page<Booking> page = (status == null)
                ? bookingRepository.findAll(pageable)
                : bookingRepository.findByStatus(status, pageable);
        return page.map(bookingMapper::toResponse);
    }

    // ===== HỦY VÉ (hoàn lại số vé) =====
    @Override
    @Transactional
    public BookingResponse updateStatus(Long id, BookingStatus status) {
        if (status == BookingStatus.CANCELLED) {
            return cancelBooking(getBookingForUpdate(id));
        }

        Booking booking = getBooking(id);
        booking.setStatus(status);
        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    private BookingResponse cancelBooking(Booking booking) {
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingException("Vé này đã bị hủy trước đó");
        }
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BookingException("Chỉ có thể hủy vé đã xác nhận");
        }
        if (DateTimeUtil.hasStarted(booking.getEvent().getEventDate())) {
            throw new BookingException("Sự kiện đã bắt đầu, không thể hủy vé");
        }

        Event event = eventRepository.findByIdForUpdate(booking.getEvent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sự kiện", "id", booking.getEvent().getId()));
        event.setAvailableTickets(Math.min(
                event.getTotalTickets(),
                event.getAvailableTickets() + booking.getQuantity()));
        booking.setStatus(BookingStatus.CANCELLED);

        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
        } else if (booking.getPaymentStatus() == PaymentStatus.PENDING) {
            booking.setPaymentStatus(PaymentStatus.FAILED);
        }

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Booking booking = getBooking(id);
        bookingRepository.delete(booking);
    }

    private Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vé", "id", id));
    }

    private Booking getBookingForUpdate(Long id) {
        return bookingRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vé", "id", id));
    }

    private User getCurrentUser() {
        var details = (com.eventbooking.eventbooking.security.CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(details.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", details.getUser().getId()));
    }
}
