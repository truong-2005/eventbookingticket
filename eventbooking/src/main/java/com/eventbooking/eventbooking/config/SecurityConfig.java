package com.eventbooking.eventbooking.config;

import com.eventbooking.eventbooking.security.CustomUserDetailsService;
import com.eventbooking.eventbooking.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import jakarta.servlet.http.HttpServletResponse;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;
    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);

        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Bỏ qua hoàn toàn security filter chain cho Swagger / OpenAPI.
     * Dùng WebSecurityCustomizer thay vì permitAll() để tránh vấn đề
     * MvcRequestMatcher không khớp path của SpringDoc trong Spring Security 6+.
     */
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring().requestMatchers(
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/v3/api-docs/**",
                "/v3/api-docs.yaml"
        );
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // CORS phải chạy trước JWT filter — truyền bean tường minh cho Spring Boot 4.x
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // JWT stateless nên tắt CSRF
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((request, response, authException) -> 
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Vui lòng đăng nhập để tiếp tục"))
            )

            .authorizeHttpRequests(auth -> auth

                    // Cho phép tất cả CORS preflight (OPTIONS) qua mà không cần token
                    .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                    // API công khai (Auth)
                    .requestMatchers(
                            "/api/register",
                            "/api/login",
                            "/api/auth/admin/login",
                            "/api/auth/admin/register",
                            "/api/auth/staff/login",
                            "/api/auth/staff/register",
                            "/api/auth/refresh-token",
                            "/api/auth/forgot-password",
                            "/api/auth/reset-password",
                            "/api/mock-vnpay/**"
                    ).permitAll()

                    // Các API công khai (chỉ GET)
                    .requestMatchers(org.springframework.http.HttpMethod.GET,
                            "/api/events",
                            "/api/events/**",
                            "/api/categories",
                            "/api/categories/**",
                            "/uploads/**"
                    ).permitAll()

                    // Tất cả request còn lại bắt buộc Bearer accessToken
                    .anyRequest().authenticated()
            )

            // Đọc Authorization: Bearer <accessToken>
            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
