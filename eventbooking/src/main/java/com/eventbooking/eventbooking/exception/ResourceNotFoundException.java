package com.eventbooking.eventbooking.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    // Tiện ích: new ResourceNotFoundException("Sự kiện", "id", 5)
    // → "Sự kiện không tồn tại với id: 5"
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(String.format("%s không tồn tại với %s: %s", resource, field, value));
    }
}
