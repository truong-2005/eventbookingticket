package com.eventbooking.eventbooking.repository;

import com.eventbooking.eventbooking.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    // Dùng khi gán role cho user khi đăng ký
    Optional<Role> findByName(String name);

    boolean existsByName(String name);
}
