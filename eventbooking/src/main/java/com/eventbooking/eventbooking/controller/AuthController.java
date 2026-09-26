package com.eventbooking.eventbooking.controller;

import com.eventbooking.eventbooking.dto.auth.*;
import com.eventbooking.eventbooking.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth", description = "Đăng nhập, đăng ký, token, mật khẩu")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ===== USER (CUSTOMER) =====

    @Operation(summary = "Đăng ký khách hàng")
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(request, "CUSTOMER"));
    }

    @Operation(summary = "Đăng nhập (username hoặc email)")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request, "CUSTOMER"));
    }

    // ===== ADMIN =====

    @Operation(summary = "Đăng nhập admin")
    @PostMapping("/auth/admin/login")
    public ResponseEntity<LoginResponse> loginAdmin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request, "ADMIN"));
    }

    @Operation(summary = "Tạo tài khoản admin (chỉ admin)")
    @PostMapping("/auth/admin/register")
    public ResponseEntity<LoginResponse> registerAdmin(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(request, "ADMIN"));
    }

    // ===== STAFF =====

    @Operation(summary = "Đăng nhập staff")
    @PostMapping("/auth/staff/login")
    public ResponseEntity<LoginResponse> loginStaff(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request, "STAFF"));
    }

    @Operation(summary = "Tạo tài khoản staff (chỉ admin)")
    @PostMapping("/auth/staff/register")
    public ResponseEntity<LoginResponse> registerStaff(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(request, "STAFF"));
    }

    // ===== TOKEN =====

    @Operation(summary = "Làm mới accessToken bằng refreshToken")
    @PostMapping("/auth/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @Operation(summary = "Đăng xuất (user + admin) — thu hồi refreshToken")
    @PostMapping("/auth/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

    // ===== MẬT KHẨU =====

    @Operation(summary = "Quên mật khẩu — gửi email chứa link")
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Đặt lại mật khẩu bằng token trong email")
    @PostMapping("/auth/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }
}
