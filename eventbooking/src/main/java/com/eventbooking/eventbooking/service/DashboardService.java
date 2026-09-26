package com.eventbooking.eventbooking.service;

import com.eventbooking.eventbooking.dto.dashboard.*;

import java.util.List;

public interface DashboardService {
    DashboardResponse getSummary();
    List<RevenueStatisticsResponse> getRevenueByDay(int days);
    List<BookingStatisticsResponse> getTopEvents(int limit);
}
