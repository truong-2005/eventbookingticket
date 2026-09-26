package com.eventbooking.eventbooking.dto.user;

import com.eventbooking.eventbooking.enums.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
        String fullName,

        @Email(message = "Email không hợp lệ")
        @Size(max = 150, message = "Email tối đa 150 ký tự")
        String email,

        @Pattern(regexp = "^0\\d{9,10}$", message = "Số điện thoại không hợp lệ")
        String phone,

        UserStatus status) {}
