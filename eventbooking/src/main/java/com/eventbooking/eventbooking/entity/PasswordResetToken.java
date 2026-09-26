package com.eventbooking.eventbooking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 255)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;                  // user và admin đều dùng được

    @Column(nullable = false)
    private LocalDateTime expiryDate;   // now + 15 phút

    @Builder.Default
    private boolean used = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
