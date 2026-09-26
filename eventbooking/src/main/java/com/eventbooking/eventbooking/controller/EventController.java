package com.eventbooking.eventbooking.controller;

import com.eventbooking.eventbooking.dto.event.*;
import com.eventbooking.eventbooking.enums.EventStatus;
import com.eventbooking.eventbooking.service.EventService;
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

@Tag(name = "Event", description = "Quản lý sự kiện")
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // ===== PUBLIC =====

    @Operation(summary = "Danh sách sự kiện (lọc title, categoryId, status)")
    @GetMapping
    public ResponseEntity<Page<EventResponse>> findAll(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) EventStatus status,
            @PageableDefault(size = 10, sort = "eventDate") Pageable pageable) {
        return ResponseEntity.ok(eventService.findAll(title, categoryId, status, pageable));
    }

    @Operation(summary = "Chi tiết sự kiện")
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.findById(id));
    }

    @Operation(summary = "Sự kiện theo trạng thái (trang chủ: UPCOMING)")
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<EventResponse>> findByStatus(
            @PathVariable EventStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(eventService.findByStatus(status, pageable));
    }

    // ===== ADMIN + STAFF =====

    @Operation(summary = "Tạo sự kiện")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PostMapping
    public ResponseEntity<EventResponse> create(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.create(request));
    }

    @Operation(summary = "Cập nhật sự kiện")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody EventUpdateRequest request) {
        return ResponseEntity.ok(eventService.update(id, request));
    }

    @Operation(summary = "Xóa sự kiện (chặn khi còn vé đã đặt)")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
