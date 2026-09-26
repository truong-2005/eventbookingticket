package com.eventbooking.eventbooking.dto.dashboard;

import java.math.BigDecimal;

public record DashboardResponse(
        BigDecimal totalRevenue,        // tổng doanh thu (vé CONFIRMED)
        Long totalTicketsSold,          // tổng số vé đã bán
        long totalBookings,             // tổng số lượt đặt vé
        long totalUsers,                // tổng user
        long totalEvents) {}            // tổng sự kiện
