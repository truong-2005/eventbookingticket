package com.eventbooking.eventbooking.exception;

import lombok.Getter;

@Getter
public class BookingException extends RuntimeException {

    private final int status;   // 400 = lỗi dữ liệu, 409 = xung đột (hết vé, trùng mã...)

    public BookingException(String message) {
        this(message, 400);
    }

    public BookingException(String message, int status) {
        super(message);
        this.status = status;
    }
}
