package com.eventbooking.eventbooking.mapper;

import com.eventbooking.eventbooking.dto.category.CategoryRequest;
import com.eventbooking.eventbooking.dto.category.CategoryResponse;
import com.eventbooking.eventbooking.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        if (category == null) {
            return null;
        }

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    public Category toEntity(CategoryRequest request) {
        if (request == null) {
            return null;
        }

        return Category.builder()
                .name(request.name())
                .description(request.description())
                .build();
    }

    public void updateEntity(Category category, CategoryRequest request) {
        if (request == null) {
            return;
        }

        if (request.name() != null) {
            category.setName(request.name());
        }

        if (request.description() != null) {
            category.setDescription(request.description());
        }
    }
}
