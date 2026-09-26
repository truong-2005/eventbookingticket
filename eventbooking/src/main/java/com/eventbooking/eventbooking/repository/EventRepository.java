package com.eventbooking.eventbooking.repository;

import com.eventbooking.eventbooking.entity.Event;
import com.eventbooking.eventbooking.enums.EventStatus;

import jakarta.persistence.LockModeType;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {

    // Tìm kiếm kết hợp: title + category + status (bỏ qua filter nào truyền null)
    @Query("""
        select e from Event e
        where (:title is null or lower(e.title) like lower(concat('%', :title, '%')))
          and (:categoryId is null or e.category.id = :categoryId)
          and (:status is null or e.status = :status)
        """)
    Page<Event> search(@Param("title") String title,
                       @Param("categoryId") Long categoryId,
                       @Param("status") EventStatus status,
                       Pageable pageable);

    // Trang chủ: chỉ sự kiện sắp diễn ra còn bán vé
    Page<Event> findByStatusOrderByEventDateAsc(EventStatus status, Pageable pageable);

    Page<Event> findByCategoryId(Long categoryId, Pageable pageable);
    boolean existsByCategoryId(Long categoryId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)   // import jakarta.persistence.LockModeType + org.springframework.data.jpa.repository.Lock
@Query("select e from Event e where e.id = :id")
Optional<Event> findByIdForUpdate(@Param("id") Long id);
}
