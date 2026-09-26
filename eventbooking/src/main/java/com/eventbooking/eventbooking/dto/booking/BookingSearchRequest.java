package com.eventbooking.eventbooking.dto.booking;

import com.eventbooking.eventbooking.enums.BookingStatus;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;

public record BookingSearchRequest(
        String keyword,             // theo mã vé / tên / email
        Long eventId,
        String customerEmail,
        BookingStatus status,
        LocalDate fromDate,         // ngày đặt từ
        LocalDate toDate,           // ngày đặt đến

        @Min(value = 0, message = "Số trang không được nhỏ hơn 0")
        Integer page,               // mặc định 0 nếu null

        @Min(value = 1, message = "Kích thước trang tối thiểu là 1")
        Integer size) {             // mặc định 10 nếu null

    public int pageOrDefault() { return page == null ? 0 : page; }
    public int sizeOrDefault() { return size == null ? 10 : size; }
}
