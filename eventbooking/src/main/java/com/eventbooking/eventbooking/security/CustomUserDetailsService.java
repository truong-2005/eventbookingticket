package com.eventbooking.eventbooking.security;

import com.eventbooking.eventbooking.entity.User;
import com.eventbooking.eventbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Spring Security gọi khi đăng nhập + khi JwtAuthenticationFilter xác thực token.
     * @param login người dùng có thể gõ username HOẶC email → tìm bằng cả hai
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(login, login)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Tài khoản không tồn tại: " + login));

        log.debug("Đã load user: {} (roles: {})", user.getUsername(),
                user.getRoles().stream()
                        .map(r -> r.getName())
                        .collect(java.util.stream.Collectors.joining(",")));

        return new CustomUserDetails(user);
    }
}
