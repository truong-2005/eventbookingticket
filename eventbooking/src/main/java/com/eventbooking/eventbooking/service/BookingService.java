package com.eventbooking.eventbooking.service;

import com.eventbooking.eventbooking.dto.booking.*;
import com.eventbooking.eventbooking.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jakarta.servlet.http.HttpServletRequest;

public interface BookingService {
    BookingResponse create(CreateBookingRequest request, HttpServletRequest httpRequest);              // trừ vé trong transaction
    BookingResponse findById(Long id);
    BookingResponse findByCode(String bookingCode);
    Page<BookingResponse> getMyBookings(Pageable pageable);            // vé của tôi
    Page<BookingResponse> findByEvent(Long eventId, Pageable pageable);
    Page<BookingResponse> findAll(BookingStatus status, Pageable pageable);
    BookingResponse updateStatus(Long id, BookingStatus status);       // hủy → hoàn vé
    void delete(Long id);                                              // chỉ ADMIN
}
