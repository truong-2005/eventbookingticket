package com.eventbooking.eventbooking.controller;

import com.eventbooking.eventbooking.dto.booking.*;
import com.eventbooking.eventbooking.enums.BookingStatus;
import com.eventbooking.eventbooking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@Tag(name = "Booking", description = "Đặt vé và quản lý vé")
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ===== NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP =====

    @Operation(summary = "Đặt vé sự kiện")
    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody CreateBookingRequest request, HttpServletRequest httpRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(request, httpRequest));
    }

    @Operation(summary = "Vé của tôi")
    @GetMapping("/my")
    public ResponseEntity<Page<BookingResponse>> getMyBookings(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(bookingService.getMyBookings(pageable));
    }

    // ===== ADMIN =====

    @Operation(summary = "Danh sách tất cả vé (lọc theo status)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<BookingResponse>> findAll(
            @RequestParam(required = false) BookingStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(bookingService.findAll(status, pageable));
    }

    @Operation(summary = "Chi tiết vé theo id")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.findById(id));
    }

    @Operation(summary = "Tra vé theo mã booking")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/code/{code}")
    public ResponseEntity<BookingResponse> findByCode(@PathVariable String code) {
        return ResponseEntity.ok(bookingService.findByCode(code));
    }

    @Operation(summary = "Danh sách vé của một sự kiện")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/event/{eventId}")
    public ResponseEntity<Page<BookingResponse>> findByEvent(
            @PathVariable Long eventId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(bookingService.findByEvent(eventId, pageable));
    }

    @Operation(summary = "Đổi trạng thái vé (hủy → hoàn vé về sự kiện)")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(@PathVariable Long id,
                                                        @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }

    @Operation(summary = "Xóa vé")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
