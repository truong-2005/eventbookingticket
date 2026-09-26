package com.eventbooking.eventbooking.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record LogoutRequest(
        @NotBlank(message = "Vui lòng gửi kèm refresh token để đăng xuất")
        String refreshToken) {}
