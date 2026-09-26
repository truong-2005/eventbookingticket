package com.eventbooking.eventbooking.entity;

import com.eventbooking.eventbooking.enums.EventStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 1000)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(nullable = false)
    private LocalDateTime eventDate;

    @Column(nullable = true)
    private LocalDateTime endTime;

    @Column(nullable = false, precision = 12, scale = 0)
    @Builder.Default
    private BigDecimal ticketPrice = BigDecimal.ZERO;

    @Min(0)
    @Column(nullable = false)
    private Integer totalTickets;

    @Min(0)
    @Column(nullable = false)
    private Integer availableTickets;   // trừ khi đặt, hoàn khi hủy

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EventStatus status = EventStatus.UPCOMING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
