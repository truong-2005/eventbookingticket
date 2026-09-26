package com.eventbooking.eventbooking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Bind các property có prefix "app.password" trong application*.properties.
 * Ví dụ:
 *   app.password.base-url=http://localhost:3000/reset-password
 */
@Component
@ConfigurationProperties(prefix = "app.password")
public class PasswordResetProperties {

    /** URL trang đặt lại mật khẩu trên Frontend (kèm vào link gửi email). */
    private String baseUrl;

    // ===== Getter / Setter =====

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }
}
