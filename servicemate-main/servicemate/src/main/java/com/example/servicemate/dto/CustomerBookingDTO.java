package com.example.servicemate.dto;

import com.example.servicemate.entity.Booking;
import com.example.servicemate.entity.BookingStatus;
import com.example.servicemate.entity.RequestPriority; // Added Import
import com.example.servicemate.entity.User;

import java.time.LocalDate;

public class CustomerBookingDTO {

    private Integer id;
    private Integer userId;
    private Integer providerId;
    private String description;
    private BookingStatus status;
    private RequestPriority priority; // NEW FIELD
    private LocalDate bookingDate;
    private String providerName;
    private String providerEmail;
    private String providerPhone;
    private String providerCity;
    private String providerServiceType;

    public static CustomerBookingDTO from(Booking booking, User provider) {
        CustomerBookingDTO dto = new CustomerBookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUserId());
        dto.setProviderId(booking.getProviderId());
        dto.setDescription(booking.getDescription());
        dto.setStatus(booking.getStatus());
        dto.setPriority(booking.getPriority()); // MAP PRIORITY
        dto.setBookingDate(booking.getBookingDate());

        if (provider != null) {
            dto.setProviderName(provider.getName());
            dto.setProviderEmail(provider.getEmail());
            dto.setProviderPhone(provider.getPhone());
            dto.setProviderCity(provider.getCity());
            dto.setProviderServiceType(provider.getServiceType());
        }

        return dto;
    }

    // --- GETTERS AND SETTERS ---

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getProviderId() { return providerId; }
    public void setProviderId(Integer providerId) { this.providerId = providerId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public RequestPriority getPriority() { return priority; } // NEW GETTER
    public void setPriority(RequestPriority priority) { this.priority = priority; } // NEW SETTER

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getProviderEmail() { return providerEmail; }
    public void setProviderEmail(String providerEmail) { this.providerEmail = providerEmail; }

    public String getProviderPhone() { return providerPhone; }
    public void setProviderPhone(String providerPhone) { this.providerPhone = providerPhone; }

    public String getProviderCity() { return providerCity; }
    public void setProviderCity(String providerCity) { this.providerCity = providerCity; }

    public String getProviderServiceType() { return providerServiceType; }
    public void setProviderServiceType(String providerServiceType) { this.providerServiceType = providerServiceType; }
}