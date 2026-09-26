package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.entity.RefreshToken;
import com.eventbooking.eventbooking.entity.User;
import com.eventbooking.eventbooking.exception.InvalidTokenException;
import com.eventbooking.eventbooking.repository.RefreshTokenRepository;
import com.eventbooking.eventbooking.service.RefreshTokenService;
import com.eventbooking.eventbooking.util.DateTimeUtil;
import com.eventbooking.eventbooking.util.ResetTokenGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.jwt.refresh-token-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Thu hồi token cũ của user (1 user chỉ giữ 1 refresh token)
        refreshTokenRepository.revokeAllByUserId(user.getId());

        RefreshToken token = RefreshToken.builder()
                .token(ResetTokenGenerator.generate())   // chuỗi random lưu DB
                .user(user)
                .expiryDate(DateTimeUtil.now().plusNanos(refreshTokenExpirationMs * 1_000_000))
                .build();
        return refreshTokenRepository.save(token);
    }

    @Override
    @Transactional
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Refresh token không tồn tại"));

        if (refreshToken.isRevoked())
            throw new InvalidTokenException("Refresh token đã bị thu hồi");
        if (DateTimeUtil.isExpired(refreshToken.getExpiryDate()))
            throw new InvalidTokenException("Refresh token đã hết hạn");

        // Rotate: revoke token cũ, client phải dùng token mới trả về
        refreshToken.setRevoked(true);
        return refreshToken;
    }

    @Override
    @Transactional
    public void revokeByToken(String token) {
        refreshTokenRepository.revokeByToken(token);
    }

    @Override
    @Transactional
    public void revokeAllByUser(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }

    // Dọn token rác mỗi ngày lúc 3h sáng — cần @EnableScheduling
    @Override
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanupExpired() {
        int deleted = refreshTokenRepository.deleteExpiredOrRevoked(LocalDateTime.now());
        log.info("Đã xóa {} refresh token hết hạn/thu hồi", deleted);
    }
}
