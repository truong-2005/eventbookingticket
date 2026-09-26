package com.eventbooking.eventbooking.dto.user;

import com.eventbooking.eventbooking.enums.UserStatus;
import jakarta.validation.constraints.*;

import java.util.Set;

public record UserRequest(
        @NotBlank(message = "Vui lòng nhập tên đăng nhập")
        @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3 đến 50 ký tự")
        String username,

        @NotBlank(message = "Vui lòng nhập email")
        @Email(message = "Email không đúng định dạng")
        String email,

        @NotBlank(message = "Vui lòng nhập mật khẩu")
        @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
        String password,

        @NotBlank(message = "Vui lòng nhập họ tên")
        @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
        String fullName,

        @Pattern(regexp = "^0\\d{9,10}$", message = "Số điện thoại không hợp lệ")
        String phone,

        Set<String> roleNames) {}   // ví dụ: ["CUSTOMER"]
