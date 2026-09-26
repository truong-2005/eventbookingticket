package com.eventbooking.eventbooking.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader(HEADER);

        // Không có Bearer → bỏ qua (cho phép endpoint public như /api/auth/login, swagger)
        if (authHeader == null || !authHeader.startsWith(PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(PREFIX.length());

        try {
            // Chỉ chấp nhận ACCESS token — refreshToken không dùng để gọi API được
            if (jwtService.isAccessTokenValid(token)) {
                final String username = jwtService.extractUsername(token);
                final String tokenType = jwtService.extractTokenType(token);

                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // Chặn token của tài khoản vừa bị khóa (user loaded lại từ DB)
                    if (userDetails.isEnabled() && userDetails.isAccountNonLocked()) {
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                    log.debug("Đã xác thực access token [{}] cho user: {}", tokenType, username);
                }
            } else {
                log.debug("Access token thiếu/sai/hết hạn — request tiếp tục như khách (chưa đăng nhập)");
            }
        } catch (Exception e) {
            log.warn("Lỗi xử lý JWT: {}", e.getMessage());
            // Không ném exception — để SecurityConfig từ chối ở authorizeHttpRequests
        }

        filterChain.doFilter(request, response);
    }
}
