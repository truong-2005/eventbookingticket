package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.dto.auth.*;
import com.eventbooking.eventbooking.dto.user.UserResponse;
import com.eventbooking.eventbooking.entity.User;
import com.eventbooking.eventbooking.exception.*;
import com.eventbooking.eventbooking.mapper.UserMapper;
import com.eventbooking.eventbooking.repository.UserRepository;
import com.eventbooking.eventbooking.security.CustomUserDetails;
import com.eventbooking.eventbooking.security.JwtService;
import com.eventbooking.eventbooking.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetService passwordResetService;
    private final UserMapper userMapper;

    @Value("${app.jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    // ===== ĐĂNG KÝ (dùng chung 3 role) =====
    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request, String roleName) {
        if (userRepository.existsByUsername(request.username()))
            throw new BookingException("Tên đăng nhập đã tồn tại");
        if (userRepository.existsByEmail(request.email()))
            throw new BookingException("Email đã được sử dụng");

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .phone(request.phone())
                .build();
        user.getRoles().add(roleService.findEntityByName(roleName));

        User saved = userRepository.save(user);
        log.info("Đăng ký tài khoản {} với role {}", saved.getUsername(), roleName);
        return buildLoginResponse(saved);
    }

    // ===== ĐĂNG NHẬP (dùng chung, chặn sai role) =====
    @Override
    @Transactional
    public LoginResponse login(LoginRequest request, String roleName) {
        User user = userRepository.findByUsernameOrEmail(request.login(), request.login())
                .orElseThrow(() -> new UnauthorizedException("Sai tên đăng nhập hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.password(), user.getPassword()))
            throw new UnauthorizedException("Sai tên đăng nhập hoặc mật khẩu");

        boolean hasRole = user.getRoles().stream()
                .anyMatch(r -> r.getName().equals(roleName));
        if (!hasRole)
            throw new UnauthorizedException("Tài khoản này không có quyền " + roleName);

        return buildLoginResponse(user);
    }

    // ===== REFRESH TOKEN =====
    @Override
    @Transactional
    public LoginResponse refreshToken(TokenRefreshRequest request) {
        var refreshToken = refreshTokenService.verifyRefreshToken(request.refreshToken());
        User user = refreshToken.getUser();
        return buildLoginResponse(user);   // rotate: token cũ đã bị revoke trong verify? -> xem RefreshTokenServiceImpl
    }

    // ===== ĐĂNG XUẤT (user/admin đều dùng) =====
    @Override
    public void logout(LogoutRequest request) {
        refreshTokenService.revokeByToken(request.refreshToken());
    }

    // ===== QUÊN / RESET MẬT KHẨU =====
    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        passwordResetService.createResetTokenForEmail(request.email());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        passwordResetService.verifyAndResetPassword(request.token(), request.newPassword());
    }

    private LoginResponse buildLoginResponse(User user) {
        String accessToken = jwtService.generateAccessToken(new CustomUserDetails(user));
        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();
        UserResponse userResponse = userMapper.toResponse(user);
        return LoginResponse.of(accessToken, refreshToken, accessTokenExpirationMs / 1000, userResponse);
    }
}
