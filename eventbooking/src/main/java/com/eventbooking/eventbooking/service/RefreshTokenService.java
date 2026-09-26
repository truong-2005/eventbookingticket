package com.eventbooking.eventbooking.service;

import com.eventbooking.eventbooking.entity.RefreshToken;
import com.eventbooking.eventbooking.entity.User;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
    RefreshToken verifyRefreshToken(String token);  // ném InvalidTokenException nếu sai/hết hạn/thu hồi
    void revokeByToken(String token);
    void revokeAllByUser(Long userId);
    void cleanupExpired();                          // @Scheduled gọi
}
