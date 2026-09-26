package com.eventbooking.eventbooking.service;

import com.eventbooking.eventbooking.dto.auth.ChangePasswordRequest;
import com.eventbooking.eventbooking.dto.user.*;
import com.eventbooking.eventbooking.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    // CRUD
    UserResponse create(UserRequest request);
    UserResponse findById(Long id);
    Page<UserResponse> findAll(String keyword, Pageable pageable);
    UserResponse update(Long id, UserUpdateRequest request);
    void delete(Long id);
    UserResponse updateStatus(Long id, UserStatus status);
    // Bổ sung
    UserResponse getMyInfo();
    UserResponse updateMyInfo(UserUpdateRequest request);
    void changePassword(ChangePasswordRequest request);
    void adminResetPassword(Long userId, AdminResetPasswordRequest request);
}
