package com.eventbooking.eventbooking.dto.booking;

import jakarta.validation.constraints.*;

public record CreateBookingRequest(
        @NotNull(message = "Vui lòng chọn sự kiện cần đặt vé")
        Long eventId,

        @NotNull(message = "Vui lòng nhập số lượng vé")
        @Min(value = 1, message = "Số lượng vé tối thiểu là 1")
        @Max(value = 10, message = "Mỗi lần chỉ được đặt tối đa 10 vé")
        Integer quantity,

        @NotBlank(message = "Vui lòng nhập tên khách hàng")
        @Size(max = 100, message = "Tên khách hàng tối đa 100 ký tự")
        String customerName,

        @NotBlank(message = "Vui lòng nhập email khách hàng")
        @Email(message = "Email không đúng định dạng")
        @Size(max = 100, message = "Email tối đa 100 ký tự")
        String customerEmail,
        
        String paymentMethod) {}
