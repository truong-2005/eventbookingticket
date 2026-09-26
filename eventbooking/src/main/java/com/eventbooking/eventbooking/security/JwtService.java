package com.eventbooking.eventbooking.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private final com.eventbooking.eventbooking.config.JwtProperties jwtProperties;

    private static final String CLAIM_TYPE = "type";
    private static final String TYPE_ACCESS = "access";
    private static final String TYPE_REFRESH = "refresh";

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ===== SINH TOKEN =====

    /** Access Token: ngắn hạn, đính kèm mỗi request qua header Bearer */
    public String generateAccessToken(CustomUserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, jwtProperties.getAccessTokenExpirationMs(), TYPE_ACCESS);
    }

    /** Refresh Token: dài hạn, dùng để lấy cặp token mới */
    public String generateRefreshToken(CustomUserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("jti", java.util.UUID.randomUUID().toString()); // định danh để thu hồi
        return buildToken(claims, userDetails, jwtProperties.getRefreshTokenExpirationMs(), TYPE_REFRESH);
    }

    private String buildToken(Map<String, Object> extraClaims, CustomUserDetails userDetails,
                              long expirationMs, String type) {
        Date now = new Date();
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())   // username (login hỗ trợ email ở bước load user)
                .claim(CLAIM_TYPE, type)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    // ===== ĐỌC TOKEN =====

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /** accessToken = "access", refreshToken = "refresh" */
    public String extractTokenType(String token) {
        return extractAllClaims(token).get(CLAIM_TYPE, String.class);
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    /** Thời gian sống còn lại (ms) — dùng cho expiresIn trả về FE */
    public long getAccessTokenValidityMs() {
        return jwtProperties.getAccessTokenExpirationMs();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ===== XÁC THỰC TOKEN =====

    /** Token hợp lệ (chữ ký đúng, chưa hết hạn) */
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT đã hết hạn");
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("JWT không hợp lệ: {}", e.getMessage());
        }
        return false;
    }

    /** Là access token còn hạn và đúng loại */
    public boolean isAccessTokenValid(String token) {
        return isTokenValid(token) && TYPE_ACCESS.equals(extractTokenType(token));
    }

    /** Là refresh token còn hạn và đúng loại — dùng ở AuthController/refresh-token */
    public boolean isRefreshTokenValid(String token) {
        return isTokenValid(token) && TYPE_REFRESH.equals(extractTokenType(token));
    }
}
