package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.dto.role.*;
import com.eventbooking.eventbooking.entity.Role;
import com.eventbooking.eventbooking.exception.*;
import com.eventbooking.eventbooking.mapper.RoleMapper;
import com.eventbooking.eventbooking.repository.RoleRepository;
import com.eventbooking.eventbooking.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Override
    @Transactional
    public RoleResponse create(RoleRequest request) {
        if (roleRepository.existsByName(request.name()))
            throw new BookingException("Role đã tồn tại: " + request.name());
        return roleMapper.toResponse(roleRepository.save(roleMapper.toEntity(request)));
    }

    @Override
    public List<RoleResponse> findAll() {
        return roleRepository.findAll().stream().map(roleMapper::toResponse).toList();
    }

    @Override
    public RoleResponse findById(Long id) {
        return roleMapper.toResponse(getRole(id));
    }

    @Override
    @Transactional
    public RoleResponse update(Long id, RoleRequest request) {
        Role role = getRole(id);
        if (request.description() != null) role.setDescription(request.description());
        return roleMapper.toResponse(roleRepository.save(role));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Role role = getRole(id);
        if ("ADMIN".equals(role.getName()) || "CUSTOMER".equals(role.getName()) || "STAFF".equals(role.getName()))
            throw new BookingException("Không được xóa role mặc định của hệ thống");
        roleRepository.delete(role);
    }

    @Override
    public Role findEntityByName(String name) {
        return roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(Role.builder().name(name).description(name).build()));
    }

    private Role getRole(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));
    }
}
