package com.eventbooking.eventbooking.dto.dashboard;

import java.math.BigDecimal;

public record RevenueStatisticsResponse(
        String day,                 // "2026-09-15"
        BigDecimal revenue) {}      // doanh thu ngày đó
