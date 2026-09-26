package com.eventbooking.eventbooking.controller;

import com.eventbooking.eventbooking.dto.dashboard.*;
import com.eventbooking.eventbooking.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Dashboard", description = "Thống kê doanh thu (chỉ ADMIN)")
@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "Tổng quan: doanh thu, vé bán, đơn, user, sự kiện")
    @GetMapping("/summary")
    public ResponseEntity<DashboardResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @Operation(summary = "Doanh thu theo ngày (mặc định 7 ngày)")
    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueStatisticsResponse>> getRevenue(
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(dashboardService.getRevenueByDay(days));
    }

    @Operation(summary = "Top sự kiện bán chạy")
    @GetMapping("/top-events")
    public ResponseEntity<List<BookingStatisticsResponse>> getTopEvents(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getTopEvents(limit));
    }
}
