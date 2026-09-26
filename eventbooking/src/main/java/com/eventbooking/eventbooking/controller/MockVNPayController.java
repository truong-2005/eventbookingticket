package com.eventbooking.eventbooking.controller;

import com.eventbooking.eventbooking.config.VNPayConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Tag(name = "Mock VNPay", description = "Giả lập cổng thanh toán VNPay")
@RestController
@RequestMapping("/api/mock-vnpay")
@RequiredArgsConstructor
public class MockVNPayController {

    @Value("${vnpay.hashSecret}")
    private String vnp_HashSecret;

    @Value("${vnpay.returnUrl}")
    private String vnp_ReturnUrl;

    @Operation(summary = "Tạo URL trả về (Return URL) với chữ ký hợp lệ")
    @PostMapping("/generate-return-url")
    public ResponseEntity<Map<String, String>> generateReturnUrl(@RequestBody Map<String, String> originalParams) {
        
        // Loại bỏ các trường không cần thiết khi tính hash trả về
        Map<String, String> responseFields = new HashMap<>(originalParams);
        responseFields.remove("vnp_SecureHash");
        responseFields.remove("vnp_SecureHashType");

        // Các trường do VNPay thêm vào lúc trả về
        responseFields.put("vnp_ResponseCode", originalParams.getOrDefault("vnp_ResponseCode", "00"));
        responseFields.put("vnp_TransactionStatus", originalParams.getOrDefault("vnp_ResponseCode", "00"));
        responseFields.put("vnp_TransactionNo", String.valueOf(System.currentTimeMillis()));
        responseFields.put("vnp_BankCode", "NCB");
        responseFields.put("vnp_BankTranNo", "VNPAY" + System.currentTimeMillis());
        responseFields.put("vnp_PayDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
        
        // Tính chữ ký bảo mật trả về
        String signValue = VNPayConfig.hmacSHA512(vnp_HashSecret, hashAllFields(responseFields));
        responseFields.put("vnp_SecureHash", signValue);

        // Tạo chuỗi query string
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : responseFields.entrySet()) {
            if (query.length() > 0) {
                query.append("&");
            }
            query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII));
            query.append("=");
            query.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
        }

        // URL chuyển hướng về trang kết quả
        String finalReturnUrl = vnp_ReturnUrl + "?" + query.toString();
        
        return ResponseEntity.ok(Map.of("returnUrl", finalReturnUrl));
    }

    private String hashAllFields(Map<String, String> fields) {
        java.util.List<String> fieldNames = new java.util.ArrayList<>(fields.keySet());
        java.util.Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        java.util.Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
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
