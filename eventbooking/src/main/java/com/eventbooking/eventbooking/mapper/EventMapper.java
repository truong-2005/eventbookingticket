package com.eventbooking.eventbooking.mapper;

import com.eventbooking.eventbooking.dto.event.EventRequest;
import com.eventbooking.eventbooking.dto.event.EventResponse;
import com.eventbooking.eventbooking.dto.event.EventUpdateRequest;
import com.eventbooking.eventbooking.entity.Category;
import com.eventbooking.eventbooking.entity.Event;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public EventResponse toResponse(Event event) {
        if (event == null) {
            return null;
        }

        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getImageUrl(),
                event.getCategory() != null ? event.getCategory().getId() : null,
                event.getCategory() != null ? event.getCategory().getName() : null,
                event.getLocation(),
                event.getEventDate(),
                event.getEndTime(),
                event.getTicketPrice(),
                event.getTotalTickets(),
                event.getAvailableTickets(),
                event.getStatus(),
                event.getCreatedAt()
        );
    }

    public Event toEntity(EventRequest request, Category category) {
        if (request == null) {
            return null;
        }

        return Event.builder()
                .title(request.title())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .location(request.location())
                .eventDate(request.eventDate())
                .endTime(request.endTime())
                .ticketPrice(request.ticketPrice())
                .totalTickets(request.totalTickets())
                .availableTickets(request.totalTickets())
                .category(category)
                .build();
    }

    public void updateEntity(Event event, EventUpdateRequest request, Category category) {
        if (request == null) {
            return;
        }

        if (request.title() != null) {
            event.setTitle(request.title());
        }
        if (request.description() != null) {
            event.setDescription(request.description());
        }
        if (request.imageUrl() != null) {
            event.setImageUrl(request.imageUrl());
        }
        if (request.location() != null) {
            event.setLocation(request.location());
        }
        if (request.eventDate() != null) {
            event.setEventDate(request.eventDate());
        }
        if (request.endTime() != null) {
            event.setEndTime(request.endTime());
        }
        if (request.ticketPrice() != null) {
            event.setTicketPrice(request.ticketPrice());
        }
        if (request.totalTickets() != null) {
            event.setTotalTickets(request.totalTickets());
        }
        if (request.categoryId() != null && category != null) {
            event.setCategory(category);
        }
        if (request.status() != null) {
            event.setStatus(request.status());
        }
    }
}
