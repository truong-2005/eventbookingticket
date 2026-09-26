package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.dto.event.*;
import com.eventbooking.eventbooking.entity.Category;
import com.eventbooking.eventbooking.entity.Event;
import com.eventbooking.eventbooking.enums.EventStatus;
import com.eventbooking.eventbooking.exception.*;
import com.eventbooking.eventbooking.mapper.EventMapper;
import com.eventbooking.eventbooking.repository.BookingRepository;
import com.eventbooking.eventbooking.repository.EventRepository;
import com.eventbooking.eventbooking.repository.CategoryRepository;
import com.eventbooking.eventbooking.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventServiceImpl implements com.eventbooking.eventbooking.service.EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final BookingRepository bookingRepository;
    private final EventMapper eventMapper;

    @Override
    @Transactional
    public EventResponse create(EventRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", request.categoryId()));
        Event event = eventMapper.toEntity(request, category);
        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Override
    public EventResponse findById(Long id) {
        return eventMapper.toResponse(getEvent(id));
    }

    @Override
    public Page<EventResponse> findAll(String title, Long categoryId, EventStatus status, Pageable pageable) {
        return eventRepository.search(
                (title == null || title.isBlank()) ? null : title,
                categoryId, status, pageable).map(eventMapper::toResponse);
    }

    @Override
    public Page<EventResponse> findByStatus(EventStatus status, Pageable pageable) {
        return eventRepository.findByStatusOrderByEventDateAsc(status, pageable)
                .map(eventMapper::toResponse);
    }

    @Override
    @Transactional
    public EventResponse update(Long id, EventUpdateRequest request) {
        Event event = getEvent(id);
        Category category = null;
        if (request.categoryId() != null) {
            category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", request.categoryId()));
        }
        eventMapper.updateEntity(event, request, category);
        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Event event = getEvent(id);
        if (bookingRepository.existsByEventIdAndStatus(id, com.eventbooking.eventbooking.enums.BookingStatus.CONFIRMED))
            throw new BookingException("Không thể xóa sự kiện đang có vé đã đặt", 409);
        eventRepository.delete(event);
        log.info("Đã xóa sự kiện id {}", id);
    }

    private Event getEvent(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sự kiện", "id", id));
    }
}
