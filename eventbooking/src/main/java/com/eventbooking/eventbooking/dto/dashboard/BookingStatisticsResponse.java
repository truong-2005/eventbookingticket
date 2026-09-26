package com.eventbooking.eventbooking.dto.dashboard;

import java.math.BigDecimal;

public record BookingStatisticsResponse(
        Long eventId,               // ID sự kiện
        String eventTitle,          // tên sự kiện
        Long bookingCount,          // số lượt đặt vé
        BigDecimal revenue) {}      // doanh thu
