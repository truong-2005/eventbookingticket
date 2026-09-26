package com.eventbooking.eventbooking.repository;

import com.eventbooking.eventbooking.entity.Booking;
import com.eventbooking.eventbooking.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingCode(String bookingCode);

    boolean existsByBookingCode(String bookingCode);

    // "Vé của tôi" (FE trang BookingsPage)
    Page<Booking> findByUserId(Long userId, Pageable pageable);

    Page<Booking> findByEventId(Long eventId, Pageable pageable);

    // Chặn đặt trùng: user đã có booking CONFIRMED cho event này
    boolean existsByUserIdAndEventIdAndStatus(Long userId, Long eventId, BookingStatus status);

    // ===== DASHBOARD =====

    // Tổng doanh thu (chỉ đếm vé đã xác nhận)
    @Query("select coalesce(sum(b.totalAmount), 0) from Booking b where b.status = :status")
    BigDecimal sumRevenueByStatus(@Param("status") BookingStatus status);

    // Tổng số vé đã bán
    @Query("select coalesce(sum(b.quantity), 0) from Booking b where b.status = :status")
    Long sumTicketsSoldByStatus(@Param("status") BookingStatus status);

    // Doanh thu theo ngày (7 ngày gần nhất) — trả về [ngày, doanh thu]
    @Query("""
        select function('date', b.createdAt), coalesce(sum(b.totalAmount), 0)
        from Booking b
        where b.status = :status and b.createdAt >= :fromDate
        group by function('date', b.createdAt)
        order by function('date', b.createdAt)
        """)
    List<Object[]> revenueByDay(@Param("status") BookingStatus status,
                                @Param("fromDate") LocalDateTime fromDate);

    long countByStatus(BookingStatus status);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    boolean existsByEventIdAndStatus(Long eventId, BookingStatus status);

@Query("""
    select b.event.id, b.event.title, count(b), coalesce(sum(b.totalAmount), 0)
    from Booking b where b.status = :status
    group by b.event.id, b.event.title
    order by sum(b.totalAmount) desc
    """)
List<Object[]> topEvents(@Param("status") BookingStatus status, Pageable pageable);
}
