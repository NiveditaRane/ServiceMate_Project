package com.example.servicemate.controller;

import com.example.servicemate.dto.BookingRequest;
import com.example.servicemate.entity.Booking;
import com.example.servicemate.entity.BookingStatus;
import com.example.servicemate.repository.BookingRepository;
import com.example.servicemate.repository.UserRepository;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingController(BookingRepository bookingRepository,
                             UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    // ✅ CREATE BOOKING
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request) {

        // Validate user
        if (!userRepository.existsById(request.getUserId())) {
            return ResponseEntity.badRequest().body("Invalid User ID");
        }

        // Validate provider
        if (!userRepository.existsById(request.getProviderId())) {
            return ResponseEntity.badRequest().body("Invalid Provider ID");
        }

        // Map DTO → Entity
        Booking booking = new Booking();
        booking.setUserId(request.getUserId());
        booking.setProviderId(request.getProviderId());
        booking.setDescription(request.getDescription());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }

    // ✅ GET ALL BOOKINGS
    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    // ✅ GET BY USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(bookingRepository.findByUserId(userId));
    }

    // ✅ GET BY PROVIDER
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<?> getBookingsByProvider(@PathVariable Integer providerId) {
        return ResponseEntity.ok(bookingRepository.findByProviderId(providerId));
    }

    // ✅ UPDATE STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestParam BookingStatus status) {

        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setStatus(status);
                    return ResponseEntity.ok(bookingRepository.save(booking));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Integer id) {

        if (!bookingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        bookingRepository.deleteById(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }
}