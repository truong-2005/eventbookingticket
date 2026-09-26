package com.eventbooking.eventbooking.controller;

import com.eventbooking.eventbooking.dto.auth.ChangePasswordRequest;
import com.eventbooking.eventbooking.dto.user.*;
import com.eventbooking.eventbooking.enums.UserStatus;
import com.eventbooking.eventbooking.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "User", description = "Quản lý người dùng + thông tin cá nhân")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ===== CRUD (ADMIN) =====

    @Operation(summary = "Tạo user (admin tạo cho staff/admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    @Operation(summary = "Danh sách user (lọc theo keyword)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<UserResponse>> findAll(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(userService.findAll(keyword, pageable));
    }

    @Operation(summary = "Xem chi tiết user")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @Operation(summary = "Cập nhật user")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    @Operation(summary = "Xóa user")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Khóa / mở khóa user")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateStatus(@PathVariable Long id,
                                                     @RequestParam UserStatus status) {
        return ResponseEntity.ok(userService.updateStatus(id, status));
    }

    @Operation(summary = "Admin đặt lại mật khẩu cho user")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reset-password")
    public ResponseEntity<Void> adminResetPassword(@PathVariable Long id,
                                                   @Valid @RequestBody AdminResetPasswordRequest request) {
        userService.adminResetPassword(id, request);
        return ResponseEntity.ok().build();
    }

    // ===== THÔNG TIN CÁ NHÂN (mọi user đã đăng nhập) =====

    @Operation(summary = "Xem thông tin của tôi")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyInfo() {
        return ResponseEntity.ok(userService.getMyInfo());
    }

    @Operation(summary = "Cập nhật thông tin của tôi")
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMyInfo(@Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateMyInfo(request));
    }

    @Operation(summary = "Đổi mật khẩu của tôi")
    @PutMapping("/me/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok().build();
    }
}
