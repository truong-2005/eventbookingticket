package com.eventbooking.eventbooking.mapper;

import com.eventbooking.eventbooking.dto.booking.BookingResponse;
import com.eventbooking.eventbooking.dto.booking.CreateBookingRequest;
import com.eventbooking.eventbooking.entity.Booking;
import com.eventbooking.eventbooking.entity.Event;
import com.eventbooking.eventbooking.entity.User;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {
        return toResponse(booking, null);
    }

    public BookingResponse toResponse(Booking booking, String paymentUrl) {
        if (booking == null) {
            return null;
        }

        Event event = booking.getEvent();

        return new BookingResponse(
                booking.getId(),
                booking.getBookingCode(),
                event != null ? event.getId() : null,
                event != null ? event.getTitle() : null,
                event != null ? event.getEventDate() : null,
                booking.getCustomerName(),
                booking.getCustomerEmail(),
                booking.getQuantity(),
                booking.getTotalAmount(),
                booking.getStatus(),
                booking.getPaymentMethod(),
                booking.getPaymentStatus(),
                paymentUrl,
                booking.getCreatedAt()
        );
    }

    public Booking toEntity(
            CreateBookingRequest request,
            User user,
            Event event,
            String bookingCode
    ) {
        if (request == null) {
            return null;
        }

        BigDecimal calculatedTotal = (event != null && event.getTicketPrice() != null && request.quantity() != null)
                ? event.getTicketPrice().multiply(BigDecimal.valueOf(request.quantity()))
                : BigDecimal.ZERO;

        return Booking.builder()
                .bookingCode(bookingCode)
                .user(user)
                .event(event)
                .customerName(request.customerName())
                .customerEmail(request.customerEmail())
                .quantity(request.quantity())
                .totalAmount(calculatedTotal)
                .paymentMethod(request.paymentMethod() != null ? com.eventbooking.eventbooking.enums.PaymentMethod.valueOf(request.paymentMethod()) : com.eventbooking.eventbooking.enums.PaymentMethod.CASH)
                .paymentStatus(com.eventbooking.eventbooking.enums.PaymentStatus.PENDING)
                .build();
    }
}
