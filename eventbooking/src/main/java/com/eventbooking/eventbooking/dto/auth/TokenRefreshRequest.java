package com.eventbooking.eventbooking.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record TokenRefreshRequest(
        @NotBlank(message = "Vui lòng gửi kèm refresh token")
        String refreshToken) {}
