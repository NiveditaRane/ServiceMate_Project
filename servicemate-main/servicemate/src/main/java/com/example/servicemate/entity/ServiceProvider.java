package com.example.servicemate.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "service_providers")
@Data
public class ServiceProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long provider_id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String service_type;
    private String location;
    private boolean availability;
}