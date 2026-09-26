package com.eventbooking.eventbooking.repository;

import com.eventbooking.eventbooking.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // Lấy token còn hiệu lực khi refresh
    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByUserId(Long userId);

    // Logout 1 thiết bị
    @Modifying
    @Query("update RefreshToken r set r.revoked = true where r.token = :token")
    int revokeByToken(@Param("token") String token);

    // Logout tất cả thiết bị của user
    @Modifying
    @Query("update RefreshToken r set r.revoked = true where r.user.id = :userId and r.revoked = false")
    int revokeAllByUserId(@Param("userId") Long userId);

    // Job dọn token hết hạn / đã thu hồi (gọi bằng @Scheduled)
    @Modifying
    @Query("delete from RefreshToken r where r.expiryDate < :now or r.revoked = true")
    int deleteExpiredOrRevoked(@Param("now") LocalDateTime now);
}
