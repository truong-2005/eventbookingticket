package com.eventbooking.eventbooking.repository;

import com.eventbooking.eventbooking.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    
    // Login: nhận username HOẶC email (dùng cho CustomUserDetailsService)
    @EntityGraph(attributePaths = "roles")
    Optional<User> findByUsernameOrEmail(String username, String email);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByUsername(String username);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "roles")
    boolean existsByUsername(String username);

    @EntityGraph(attributePaths = "roles")
    boolean existsByEmail(String email);
    
    @EntityGraph(attributePaths = "roles")
    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String username, String email, Pageable pageable);

    @EntityGraph(attributePaths = "roles")
    Page<User> findAll(Pageable pageable);
}
