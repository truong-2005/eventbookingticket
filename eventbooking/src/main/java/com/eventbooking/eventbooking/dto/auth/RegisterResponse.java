package com.eventbooking.eventbooking.dto.auth;

import com.eventbooking.eventbooking.dto.user.UserResponse;

public record RegisterResponse(
        String message,
        UserResponse user,
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn) {

    public static RegisterResponse of(String message, UserResponse user) {
        return new RegisterResponse(message, user, null, null, null, null);
    }

    public static RegisterResponse success(UserResponse user) {
        return new RegisterResponse("Đăng ký tài khoản thành công", user, null, null, null, null);
    }

    public static RegisterResponse withToken(String message, UserResponse user, String accessToken, String refreshToken, long expiresIn) {
        return new RegisterResponse(message, user, accessToken, refreshToken, "Bearer", expiresIn);
    }
}
