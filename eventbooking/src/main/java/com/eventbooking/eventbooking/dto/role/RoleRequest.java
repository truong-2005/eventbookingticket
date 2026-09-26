package com.eventbooking.eventbooking.dto.role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RoleRequest(
        @NotBlank(message = "Vui lòng nhập tên vai trò")
        String name,

        @Size(max = 255, message = "Mô tả tối đa 255 ký tự")
        String description) {}
