package com.eventbooking.eventbooking.mapper;

import com.eventbooking.eventbooking.dto.user.UserResponse;
import com.eventbooking.eventbooking.entity.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getStatus(),
                user.getRoles() != null
                        ? user.getRoles()
                        .stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toSet())
                        : java.util.Collections.emptySet(),
                user.getCreatedAt()
        );
    }
}
