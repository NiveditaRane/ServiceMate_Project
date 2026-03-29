package com.example.servicemate.controller;

import com.example.servicemate.entity.Booking;
import com.example.servicemate.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider")
@CrossOrigin(origins = "*") // Allows the frontend to talk to this API
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    // 1. Get all jobs assigned to a specific provider
    @GetMapping("/jobs/{providerId}")
    public List<Booking> getJobs(@PathVariable Long providerId) {
        return providerService.getProviderJobs(providerId);
    }

    // 2. Accept/Reject or Update Booking Status
    @PutMapping("/booking/{bookingId}")
    public Booking updateStatus(@PathVariable Long bookingId, @RequestParam String status) {
        return providerService.updateBookingStatus(bookingId, status);
    }
}