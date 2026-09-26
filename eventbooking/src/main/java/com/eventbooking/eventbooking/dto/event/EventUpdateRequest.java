package com.eventbooking.eventbooking.dto.event;

import com.eventbooking.eventbooking.enums.EventStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EventUpdateRequest(
        @NotBlank(message = "Vui lòng nhập tên sự kiện")
        @Size(max = 200, message = "Tên sự kiện tối đa 200 ký tự")
        String title,

        @Size(max = 5000, message = "Mô tả tối đa 5000 ký tự")
        String description,

        @Size(max = 1000, message = "URL hình ảnh tối đa 1000 ký tự")
        String imageUrl,

        @NotNull(message = "Vui lòng chọn danh mục sự kiện")
        Long categoryId,

        @NotBlank(message = "Vui lòng nhập địa điểm tổ chức")
        @Size(max = 255, message = "Địa điểm tối đa 255 ký tự")
        String location,

        @NotNull(message = "Vui lòng chọn ngày diễn ra sự kiện")
        LocalDateTime eventDate,

        LocalDateTime endTime,

        @NotNull(message = "Vui lòng nhập giá vé")
        @DecimalMin(value = "0.0", message = "Giá vé phải lớn hơn hoặc bằng 0")
        BigDecimal ticketPrice,

        @NotNull(message = "Vui lòng nhập tổng số vé")
        @Min(value = 1, message = "Tổng số vé phải ít nhất là 1")
        Integer totalTickets,

        EventStatus status) {}
