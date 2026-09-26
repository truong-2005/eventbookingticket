package com.eventbooking.eventbooking.service;

import com.eventbooking.eventbooking.dto.auth.*;

public interface AuthService {
    LoginResponse register(RegisterRequest request, String roleName); // dùng chung cho user/staff/admin
    LoginResponse login(LoginRequest request, String roleName);       // chặn sai role
    LoginResponse refreshToken(TokenRefreshRequest request);
    void logout(LogoutRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
