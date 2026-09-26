package com.eventbooking.eventbooking.service;

public interface EmailService {
    void sendResetPasswordEmail(String to, String link);
}
