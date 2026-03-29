package com.example.servicemate.service;

import com.example.servicemate.entity.Booking;
import com.example.servicemate.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProviderService {

    @Autowired
    private BookingRepository bookingRepository;

    // Task: Get provider jobs
    public List<Booking> getProviderJobs(Long providerId) {
        // This now calls the Native Query defined in your Repository
        return bookingRepository.findJobsByProviderId(providerId);
    }

    // Task: Accept/Reject booking (Update status)
    public Booking updateBookingStatus(Long bookingId, String newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
        
        // Updates the status field (Lombok provides this method)
        booking.setStatus(newStatus); 
        
        // Saves the updated booking back to the database
        return bookingRepository.save(booking);
    }
}