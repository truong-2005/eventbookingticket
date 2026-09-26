package com.eventbooking.eventbooking.service;

import com.eventbooking.eventbooking.dto.event.*;
import com.eventbooking.eventbooking.enums.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventService {
    EventResponse create(EventRequest request);
    EventResponse findById(Long id);
    Page<EventResponse> findAll(String title, Long categoryId, EventStatus status, Pageable pageable);
    Page<EventResponse> findByStatus(EventStatus status, Pageable pageable); // trang chủ
    EventResponse update(Long id, EventUpdateRequest request);
    void delete(Long id);   // chặn xóa khi còn booking CONFIRMED
}
