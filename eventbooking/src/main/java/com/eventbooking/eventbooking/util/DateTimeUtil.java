package com.eventbooking.eventbooking.util;

import java.time.*;
import java.time.format.DateTimeFormatter;

public final class DateTimeUtil {

    public static final ZoneId VIETNAM_ZONE =
            ZoneId.of("Asia/Ho_Chi_Minh");

    public static final DateTimeFormatter DISPLAY_FORMAT =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private DateTimeUtil() {
        throw new IllegalStateException("Utility class");
    }

    // Thời gian hiện tại tại Việt Nam
    public static LocalDateTime now() {
        return LocalDateTime.now(VIETNAM_ZONE);
    }

    // Format: 25/12/2025 19:30
    public static String format(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }

        return dateTime.format(DISPLAY_FORMAT);
    }

    // Chuyển chuỗi dd/MM/yyyy HH:mm thành LocalDateTime
    public static LocalDateTime parse(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return LocalDateTime.parse(value, DISPLAY_FORMAT);
    }

    // Kiểm tra thời gian đã hết hạn
    public static boolean isExpired(LocalDateTime expiryDate) {
        return expiryDate == null || expiryDate.isBefore(now());
    }

    // Kiểm tra thời gian còn hiệu lực
    public static boolean isValid(LocalDateTime expiryDate) {
        return expiryDate != null && expiryDate.isAfter(now());
    }

    // Tạo thời gian hết hạn sau số phút
    public static LocalDateTime plusMinutes(long minutes) {
        return now().plusMinutes(minutes);
    }

    // Tạo thời gian hết hạn sau số ngày
    public static LocalDateTime plusDays(long days) {
        return now().plusDays(days);
    }

    // Bắt đầu ngày — dùng cho thống kê doanh thu
    public static LocalDateTime startOfDay(LocalDate date) {
        return date.atStartOfDay();
    }

    // Bắt đầu ngày kế tiếp — dùng làm mốc toDate độc quyền
    public static LocalDateTime startOfNextDay(LocalDate date) {
        return date.plusDays(1).atStartOfDay();
    }

    // Khoảng thời gian của một ngày: [00:00, ngày kế tiếp 00:00)
    public static LocalDateTime[] dayRange(LocalDate date) {
        return new LocalDateTime[] {
                startOfDay(date),
                startOfNextDay(date)
        };
    }

    // Kiểm tra event đã bắt đầu chưa
    public static boolean hasStarted(LocalDateTime eventDate) {
        return eventDate != null && !eventDate.isAfter(now());
    }

    // Kiểm tra event còn ở tương lai
    public static boolean isUpcoming(LocalDateTime eventDate) {
        return eventDate != null && eventDate.isAfter(now());
    }
}
