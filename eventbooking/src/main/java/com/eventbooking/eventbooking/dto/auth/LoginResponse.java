package com.eventbooking.eventbooking.dto.auth;

import com.eventbooking.eventbooking.dto.user.UserResponse;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType,       // "Bearer"
        long expiresIn,         // accessToken hết hạn sau (giây)
        UserResponse user) {

    public static LoginResponse of(String accessToken, String refreshToken, long expiresIn, UserResponse user) {
        return new LoginResponse(accessToken, refreshToken, "Bearer", expiresIn, user);
    }
}
