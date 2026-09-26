package com.eventbooking.eventbooking.exception;

import java.time.LocalDateTime;

public record ErrorResponse(
        int status,             // mã HTTP: 400, 401, 404...
        String message,         // thông báo tiếng Việt
        LocalDateTime timestamp) {

    public static ErrorResponse of(int status, String message) {
        return new ErrorResponse(status, message, LocalDateTime.now());
    }
}
