package com.eventbooking.eventbooking.repository;

import com.eventbooking.eventbooking.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // Tìm token hợp lệ (chưa dùng) khi reset
    Optional<PasswordResetToken> findByToken(String token);

    // Vô hiệu hóa token cũ khi user yêu cầu quên mật khẩu lần nữa
    @Modifying
    @Query("update PasswordResetToken p set p.used = true where p.user.id = :userId and p.used = false")
    int invalidateAllByUserId(@Param("userId") Long userId);

    // Dọn token hết hạn / đã dùng
    @Modifying
    @Query("delete from PasswordResetToken p where p.expiryDate < :now or p.used = true")
    int deleteExpiredOrUsed(@Param("now") LocalDateTime now);
}
