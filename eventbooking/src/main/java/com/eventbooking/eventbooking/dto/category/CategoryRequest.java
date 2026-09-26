package com.eventbooking.eventbooking.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "Vui lòng nhập tên danh mục")
        @Size(max = 100, message = "Tên danh mục tối đa 100 ký tự")
        String name,

        @Size(max = 255, message = "Mô tả tối đa 255 ký tự")
        String description) {}
