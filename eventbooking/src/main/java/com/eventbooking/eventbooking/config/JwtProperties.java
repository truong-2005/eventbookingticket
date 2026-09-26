package com.eventbooking.eventbooking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Bind các property có prefix "app.jwt" trong application*.properties.
 * Ví dụ:
 *   app.jwt.secret=...
 *   app.jwt.access-token-expiration-ms=1800000
 *   app.jwt.refresh-token-expiration-ms=604800000
 */
@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /** Khóa bí mật (Base64) dùng để ký / xác thực JWT. */
    private String secret;

    /** Thời gian sống của accessToken (ms). Mặc định 30 phút. */
    private long accessTokenExpirationMs = 1_800_000L;

    /** Thời gian sống của refreshToken (ms). Mặc định 7 ngày. */
    private long refreshTokenExpirationMs = 604_800_000L;

    // ===== Getters / Setters =====

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getAccessTokenExpirationMs() {
        return accessTokenExpirationMs;
    }

    public void setAccessTokenExpirationMs(long accessTokenExpirationMs) {
        this.accessTokenExpirationMs = accessTokenExpirationMs;
    }

    public long getRefreshTokenExpirationMs() {
        return refreshTokenExpirationMs;
    }

    public void setRefreshTokenExpirationMs(long refreshTokenExpirationMs) {
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }
}
