package com.eventbooking.eventbooking.security;

import com.eventbooking.eventbooking.entity.User;
import com.eventbooking.eventbooking.enums.UserStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;   // entity User của project

    /** ROLE_ADMIN, ROLE_STAFF, ROLE_CUSTOMER — dùng cho @PreAuthorize("hasRole('ADMIN')") */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName().toUpperCase()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return user.getPassword();   // đã là BCrypt hash
    }

    /** Nhận dạng chính — luôn là username; email được xử lý ở CustomUserDetailsService */
    @Override
    public String getUsername() {
        return user.getUsername();
    }

    public Long getUserId() {
        return user.getId();
    }

    public String getEmail() {
        return user.getEmail();
    }

    // ===== Trạng thái tài khoản =====
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.getStatus() != UserStatus.INACTIVE;   // INACTIVE = bị khóa
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getStatus() == UserStatus.ACTIVE;
    }
}
