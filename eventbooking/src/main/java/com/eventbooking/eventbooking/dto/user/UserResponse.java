package com.eventbooking.eventbooking.dto.user;

import com.eventbooking.eventbooking.enums.UserStatus;

import java.time.LocalDateTime;
import java.util.Set;

public record UserResponse(
        Long id,
        String username,
        String email,
        String fullName,
        String phone,
        UserStatus status,
        Set<String> roles,          // ["CUSTOMER"]
        LocalDateTime createdAt) {}
