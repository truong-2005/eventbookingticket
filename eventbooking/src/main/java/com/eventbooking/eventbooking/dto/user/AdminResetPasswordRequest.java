package com.eventbooking.eventbooking.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminResetPasswordRequest(
        @NotBlank(message = "Vui lòng nhập mật khẩu mới cho người dùng")
        @Size(min = 6, max = 100, message = "Mật khẩu mới phải có ít nhất 6 ký tự")
        String newPassword) {}
