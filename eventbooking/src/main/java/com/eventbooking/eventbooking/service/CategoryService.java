package com.eventbooking.eventbooking.service;

import com.eventbooking.eventbooking.dto.category.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    CategoryResponse create(CategoryRequest request);
    Page<CategoryResponse> findAll(Pageable pageable);
    CategoryResponse findById(Long id);
    CategoryResponse update(Long id, CategoryRequest request);
    void delete(Long id);   // chặn xóa khi còn event
}
