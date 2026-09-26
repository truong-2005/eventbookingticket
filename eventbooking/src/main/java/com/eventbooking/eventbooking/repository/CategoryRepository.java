package com.eventbooking.eventbooking.repository;

import com.eventbooking.eventbooking.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    // Chặn tạo category trùng tên
    boolean existsByName(String name);
}
