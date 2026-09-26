package com.eventbooking.eventbooking.service;

public interface PasswordResetService {
    void createResetTokenForEmail(String email);   // invalidate token cũ + gửi mail
    void verifyAndResetPassword(String token, String newPassword);
}
