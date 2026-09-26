package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.dto.category.*;
import com.eventbooking.eventbooking.entity.Category;
import com.eventbooking.eventbooking.exception.*;
import com.eventbooking.eventbooking.mapper.CategoryMapper;
import com.eventbooking.eventbooking.repository.CategoryRepository;
import com.eventbooking.eventbooking.repository.EventRepository;
import com.eventbooking.eventbooking.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final EventRepository eventRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.name()))
            throw new BookingException("Tên danh mục đã tồn tại");
        return categoryMapper.toResponse(categoryRepository.save(categoryMapper.toEntity(request)));
    }

    @Override
    public Page<CategoryResponse> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(categoryMapper::toResponse);
    }

    @Override
    public CategoryResponse findById(Long id) {
        return categoryMapper.toResponse(getCategory(id));
    }

    @Override
    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = getCategory(id);
        if (request.name() != null && !request.name().equals(category.getName())
                && categoryRepository.existsByName(request.name()))
            throw new BookingException("Tên danh mục đã tồn tại");
        categoryMapper.updateEntity(category, request);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Category category = getCategory(id);
        if (eventRepository.existsByCategoryId(id))
            throw new BookingException("Không thể xóa danh mục đang có sự kiện", 409);
        categoryRepository.delete(category);
    }

    private Category getCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", id));
    }
}
