package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.entity.PasswordResetToken;
import com.eventbooking.eventbooking.entity.User;
import com.eventbooking.eventbooking.exception.*;
import com.eventbooking.eventbooking.repository.PasswordResetTokenRepository;
import com.eventbooking.eventbooking.repository.UserRepository;
import com.eventbooking.eventbooking.service.EmailService;
import com.eventbooking.eventbooking.service.PasswordResetService;
import com.eventbooking.eventbooking.util.DateTimeUtil;
import com.eventbooking.eventbooking.util.ResetTokenGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.password.base-url:http://localhost:3000/reset-password}")
    private String baseUrl;

    @Override
    @Transactional
    public void createResetTokenForEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "email", email));

        tokenRepository.invalidateAllByUserId(user.getId());   // token cũ vô hiệu

        PasswordResetToken token = PasswordResetToken.builder()
                .token(ResetTokenGenerator.generate())
                .user(user)
                .expiryDate(DateTimeUtil.plusMinutes(30))   // hiệu lực 30 phút
                .build();
        tokenRepository.save(token);

        String link = baseUrl + "?token=" + token.getToken();
        emailService.sendResetPasswordEmail(user.getEmail(), link);
        log.info("Đã gửi email reset mật khẩu tới {}", email);
    }

    @Override
    @Transactional
    public void verifyAndResetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Liên kết đặt lại mật khẩu không hợp lệ"));

        if (resetToken.isUsed())
            throw new InvalidTokenException("Liên kết đã được sử dụng");
        if (DateTimeUtil.isExpired(resetToken.getExpiryDate()))
            throw new InvalidTokenException("Liên kết đã hết hạn");

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        log.info("User {} đã đặt lại mật khẩu thành công", user.getUsername());
    }
}
