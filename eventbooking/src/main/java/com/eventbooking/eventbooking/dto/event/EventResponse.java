package com.eventbooking.eventbooking.dto.event;

import com.eventbooking.eventbooking.enums.EventStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String title,
        String description,
        String imageUrl,
        Long categoryId,
        String categoryName,
        String location,
        LocalDateTime eventDate,
        LocalDateTime endTime,
        BigDecimal ticketPrice,
        Integer totalTickets,
        Integer availableTickets,
        EventStatus status,
        LocalDateTime createdAt) {}
