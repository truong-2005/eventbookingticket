package com.eventbooking.eventbooking.controller;

import com.eventbooking.eventbooking.config.VNPayConfig;
import com.eventbooking.eventbooking.entity.Booking;
import com.eventbooking.eventbooking.enums.PaymentStatus;
import com.eventbooking.eventbooking.repository.BookingRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Tag(name = "Payment", description = "Xử lý thanh toán VNPay")
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final BookingRepository bookingRepository;

    @Value("${vnpay.hashSecret}")
    private String vnp_HashSecret;

    @Operation(summary = "VNPay IPN / Return URL callback")
    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }

        String signValue = VNPayConfig.hmacSHA512(vnp_HashSecret, hashAllFields(fields));

        if (signValue.equals(vnp_SecureHash)) {
            String txnRef = request.getParameter("vnp_TxnRef");
            String responseCode = request.getParameter("vnp_ResponseCode");
            String transactionNo = request.getParameter("vnp_TransactionNo");

            Booking booking = bookingRepository.findByBookingCode(txnRef).orElse(null);
            if (booking != null) {
                if ("00".equals(responseCode)) {
                    booking.setPaymentStatus(PaymentStatus.PAID);
                    booking.setTransactionId(transactionNo);
                    booking.setPaymentDate(LocalDateTime.now());
                    bookingRepository.save(booking);
                    return ResponseEntity.ok(Map.of("message", "Thanh toán thành công"));
                } else {
                    booking.setPaymentStatus(PaymentStatus.FAILED);
                    bookingRepository.save(booking);
                    return ResponseEntity.badRequest().body(Map.of("message", "Thanh toán thất bại"));
                }
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy giao dịch"));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Chữ ký không hợp lệ"));
        }
    }

    private String hashAllFields(Map<String, String> fields) {
        java.util.List<String> fieldNames = new java.util.ArrayList<>(fields.keySet());
        java.util.Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        java.util.Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                sb.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return sb.toString();
    }
}
