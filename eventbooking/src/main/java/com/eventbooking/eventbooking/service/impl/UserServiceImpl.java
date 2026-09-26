package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.dto.auth.ChangePasswordRequest;
import com.eventbooking.eventbooking.dto.user.*;
import com.eventbooking.eventbooking.entity.Role;
import com.eventbooking.eventbooking.entity.User;
import com.eventbooking.eventbooking.enums.UserStatus;
import com.eventbooking.eventbooking.exception.*;
import com.eventbooking.eventbooking.mapper.UserMapper;
import com.eventbooking.eventbooking.repository.UserRepository;
import com.eventbooking.eventbooking.service.RefreshTokenService;
import com.eventbooking.eventbooking.service.RoleService;
import com.eventbooking.eventbooking.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    // ===== CRUD =====

    @Override
    @Transactional
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByUsername(request.username()))
            throw new BookingException("Tên đăng nhập đã tồn tại");
        if (userRepository.existsByEmail(request.email()))
            throw new BookingException("Email đã được sử dụng");

        Set<Role> roles = (request.roleNames() == null || request.roleNames().isEmpty())
                ? Set.of(roleService.findEntityByName("CUSTOMER"))
                : request.roleNames().stream()
                    .map(name -> roleService.findEntityByName(name))
                    .collect(Collectors.toSet());

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .phone(request.phone())
                .status(UserStatus.ACTIVE)
                .build();
        user.setRoles(roles);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return userMapper.toResponse(getUser(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> findAll(String keyword, Pageable pageable) {
        Page<User> page = (keyword == null || keyword.isBlank())
                ? userRepository.findAll(pageable)
                : userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        keyword, keyword, pageable);
        return page.map(userMapper::toResponse);
    }


    @Override
    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = getUser(id);
        if (request.fullName() != null) user.setFullName(request.fullName());
        if (request.email() != null && !request.email().isBlank()) user.setEmail(request.email());
        if (request.phone() != null) user.setPhone(request.phone());
        if (request.status() != null) user.setStatus(request.status());
        return userMapper.toResponse(userRepository.save(user));
    }


    @Override
    @Transactional
    public void delete(Long id) {
        User user = getUser(id);
        refreshTokenService.revokeAllByUser(id);   // đăng xuất hết thiết bị
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public UserResponse updateStatus(Long id, UserStatus status) {
        User user = getUser(id);
        user.setStatus(status);
        if (status == UserStatus.INACTIVE) refreshTokenService.revokeAllByUser(id);
        return userMapper.toResponse(userRepository.save(user));
    }

    // ===== THÔNG TIN CÁ NHÂN =====

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMyInfo() {
        return userMapper.toResponse(getCurrentUser());
    }

    @Override
    @Transactional
    public UserResponse updateMyInfo(UserUpdateRequest request) {
        User user = getCurrentUser();
        if (request.fullName() != null) user.setFullName(request.fullName());
        if (request.phone() != null) user.setPhone(request.phone());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword()))
            throw new UnauthorizedException("Mật khẩu hiện tại không đúng");
        if (passwordEncoder.matches(request.newPassword(), user.getPassword()))
            throw new BookingException("Mật khẩu mới không được trùng mật khẩu cũ");
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        refreshTokenService.revokeAllByUser(user.getId());  // buộc đăng nhập lại
        log.info("User {} đã đổi mật khẩu", user.getUsername());
    }

    @Override
    @Transactional
    public void adminResetPassword(Long userId, AdminResetPasswordRequest request) {
        User user = getUser(userId);
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        refreshTokenService.revokeAllByUser(userId);
        log.info("Admin đã reset mật khẩu cho user id {}", userId);
    }

    // ===== HELPER =====

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", id));
    }

    private User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        com.eventbooking.eventbooking.security.CustomUserDetails details =
                (com.eventbooking.eventbooking.security.CustomUserDetails) authentication.getPrincipal();
        return details.getUser();
    }
}
