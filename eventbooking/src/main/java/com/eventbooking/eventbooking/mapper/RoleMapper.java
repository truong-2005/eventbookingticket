package com.eventbooking.eventbooking.mapper;

import com.eventbooking.eventbooking.dto.role.RoleResponse;
import com.eventbooking.eventbooking.dto.role.RoleRequest;
import com.eventbooking.eventbooking.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public RoleResponse toResponse(Role role) {
        if (role == null) {
            return null;
        }

        return new RoleResponse(
                role.getId(),
                role.getName(),
                role.getDescription()
        );
    }

    public Role toEntity(RoleRequest request) {
        if (request == null) {
            return null;
        }

        return Role.builder()
                .name(request.name())
                .description(request.description())
                .build();
    }

    public void updateEntity(Role role, RoleRequest request) {
        if (request == null) {
            return;
        }

        if (request.name() != null) {
            role.setName(request.name());
        }

        if (request.description() != null) {
            role.setDescription(request.description());
        }
    }
}
