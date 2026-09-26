package com.eventbooking.eventbooking.dto.auth;

import jakarta.validation.constraints.*;

public record ResetPasswordRequest(
        @NotBlank(message = "Token đặt lại mật khẩu không được để trống")
        String token,

        @NotBlank(message = "Vui lòng nhập mật khẩu mới")
        @Size(min = 6, max = 100, message = "Mật khẩu mới phải có ít nhất 6 ký tự")
        String newPassword,

        @NotBlank(message = "Vui lòng nhập lại mật khẩu mới")
        String confirmPassword) {

    @AssertTrue(message = "Mật khẩu nhập lại không khớp với mật khẩu mới")
    public boolean isPasswordMatching() {
        return newPassword != null && newPassword.equals(confirmPassword);
    }
}
