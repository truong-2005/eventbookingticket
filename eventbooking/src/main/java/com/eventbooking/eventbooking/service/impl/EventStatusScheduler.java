package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.entity.Event;
import com.eventbooking.eventbooking.enums.EventStatus;
import com.eventbooking.eventbooking.repository.EventRepository;
import com.eventbooking.eventbooking.util.DateTimeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Component
public class EventStatusScheduler {

    private final EventRepository eventRepository;

    public EventStatusScheduler(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Scheduled(fixedDelayString = "${events.status.refresh-delay-ms:30000}")
    @Transactional
    public void synchronizeEventStatuses() {
        LocalDateTime now = DateTimeUtil.now();
        int updatedCount = 0;

        for (Event event : eventRepository.findByStatusIn(
                List.of(EventStatus.UPCOMING, EventStatus.ONGOING))) {
            LocalDateTime startTime = event.getEventDate();
            if (startTime == null) continue;

            // Legacy events without an explicit end time are treated as ending at midnight.
            LocalDateTime endTime = event.getEndTime() != null
                    ? event.getEndTime()
                    : startTime.toLocalDate().atTime(LocalTime.MAX);

            if (!now.isBefore(endTime)) {
                event.setStatus(EventStatus.COMPLETED);
                updatedCount++;
            } else if (event.getStatus() == EventStatus.UPCOMING && !now.isBefore(startTime)) {
                event.setStatus(EventStatus.ONGOING);
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            log.info("Automatically updated status for {} events", updatedCount);
        }
    }
}
