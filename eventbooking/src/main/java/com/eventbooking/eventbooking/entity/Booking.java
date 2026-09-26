package com.eventbooking.eventbooking.entity;

import com.eventbooking.eventbooking.enums.BookingStatus;
import com.eventbooking.eventbooking.enums.PaymentMethod;
import com.eventbooking.eventbooking.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String bookingCode;         // BK-20260914-XXXX

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;                  // nullable → khách vãng lai vẫn đặt được

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(nullable = false, length = 100)
    private String customerName;

    @Column(nullable = false, length = 100)
    private String customerEmail;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal totalAmount;     // tính ở backend = ticketPrice × quantity

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 20)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
