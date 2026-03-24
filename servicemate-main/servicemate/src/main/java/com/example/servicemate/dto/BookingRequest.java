package com.example.servicemate.dto;

import jakarta.validation.constraints.NotNull;

public class BookingRequest {

    @NotNull
    private Integer userId;

    @NotNull
    private Integer providerId;

    // Optional fields (add if needed)
    private String description;

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getProviderId() {
        return providerId;
    }

    public void setProviderId(Integer providerId) {
        this.providerId = providerId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}