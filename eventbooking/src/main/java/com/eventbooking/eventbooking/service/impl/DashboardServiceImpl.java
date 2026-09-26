package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.dto.dashboard.*;
import com.eventbooking.eventbooking.enums.BookingStatus;
import com.eventbooking.eventbooking.repository.BookingRepository;
import com.eventbooking.eventbooking.repository.EventRepository;
import com.eventbooking.eventbooking.repository.UserRepository;
import com.eventbooking.eventbooking.service.DashboardService;
import com.eventbooking.eventbooking.util.DateTimeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @Override
    public DashboardResponse getSummary() {
        return new DashboardResponse(
                bookingRepository.sumRevenueByStatus(BookingStatus.CONFIRMED),  // tổng doanh thu
                bookingRepository.sumTicketsSoldByStatus(BookingStatus.CONFIRMED), // tổng vé bán
                bookingRepository.countByStatus(BookingStatus.CONFIRMED),        // tổng đơn
                userRepository.count(),                                          // tổng user
                eventRepository.count());                                        // tổng event
    }

    @Override
    public List<RevenueStatisticsResponse> getRevenueByDay(int days) {
        LocalDate today = LocalDate.now(DateTimeUtil.VIETNAM_ZONE);
        var fromDate = DateTimeUtil.startOfDay(today.minusDays(days - 1));

        return bookingRepository.revenueByDay(BookingStatus.CONFIRMED, fromDate).stream()
                .map(row -> new RevenueStatisticsResponse(
                        String.valueOf(row[0]),           // ngày
                        (BigDecimal) row[1]))             // doanh thu
                .toList();
    }

    @Override
    public List<BookingStatisticsResponse> getTopEvents(int limit) {
        return bookingRepository.topEvents(BookingStatus.CONFIRMED, PageRequest.of(0, limit)).stream()
                .map(row -> new BookingStatisticsResponse(
                        (Long) row[0],                    // eventId
                        (String) row[1],                  // eventTitle
                        (Long) row[2],                    // số booking
                        (BigDecimal) row[3]))             // doanh thu
                .toList();
    }
}
