package com.eventbooking.eventbooking.dto.auth;

public record TokenRefreshResponse(
        String accessToken,
        String refreshToken,
        String tokenType,       // "Bearer"
        long expiresIn) {

    public static TokenRefreshResponse of(String accessToken, String refreshToken, long expiresIn) {
        return new TokenRefreshResponse(accessToken, refreshToken, "Bearer", expiresIn);
    }
}
