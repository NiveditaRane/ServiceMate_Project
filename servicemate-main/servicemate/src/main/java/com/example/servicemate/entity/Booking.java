package com.example.servicemate.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long booking_id;

    private Long user_id; // The Customer
    
    @ManyToOne
    @JoinColumn(name = "provider_id")
    private ServiceProvider provider;

    private Long service_id;
    private LocalDateTime booking_date;
    private String status; // 'pending', 'confirmed', 'completed', 'cancelled'
}