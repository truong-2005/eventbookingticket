package com.eventbooking.eventbooking.service;

import com.eventbooking.eventbooking.dto.role.*;
import com.eventbooking.eventbooking.entity.Role;

import java.util.List;

public interface RoleService {
    RoleResponse create(RoleRequest request);
    List<RoleResponse> findAll();
    RoleResponse findById(Long id);
    RoleResponse update(Long id, RoleRequest request);
    void delete(Long id);
    Role findEntityByName(String name);   // dùng nội bộ
}
