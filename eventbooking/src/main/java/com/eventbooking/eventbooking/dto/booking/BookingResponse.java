package com.eventbooking.eventbooking.dto.booking;

import com.eventbooking.eventbooking.enums.BookingStatus;
import com.eventbooking.eventbooking.enums.PaymentMethod;
import com.eventbooking.eventbooking.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        String bookingCode,
        Long eventId,
        String eventTitle,
        LocalDateTime eventDate,
        String customerName,
        String customerEmail,
        Integer quantity,
        BigDecimal totalAmount,
        BookingStatus status,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        String paymentUrl,
        LocalDateTime createdAt) {}
