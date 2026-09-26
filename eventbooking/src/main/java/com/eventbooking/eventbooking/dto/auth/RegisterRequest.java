package com.eventbooking.eventbooking.dto.auth;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank(message = "Vui lòng nhập tên đăng nhập")
        @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3 đến 50 ký tự")
        @Pattern(regexp = "^[a-zA-Z0-9_.]+$", message = "Tên đăng nhập chỉ gồm chữ, số, dấu gạch dưới và dấu chấm")
        String username,

        @NotBlank(message = "Vui lòng nhập email")
        @Email(message = "Email không đúng định dạng")
        @Size(max = 100, message = "Email tối đa 100 ký tự")
        String email,

        @NotBlank(message = "Vui lòng nhập mật khẩu")
        @Size(min = 6, max = 100, message = "Mật khẩu phải có ít nhất 6 ký tự")
        String password,

        @NotBlank(message = "Vui lòng nhập họ tên")
        @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
        String fullName,

        @Pattern(regexp = "^0\\d{9,10}$", message = "Số điện thoại không hợp lệ (bắt đầu bằng 0, gồm 10-11 số)")
        String phone) {}
