package com.example.servicemate.repository;

import com.example.servicemate.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Using a Native SQL query to bypass Java naming issues
    @Query(value = "SELECT * FROM bookings WHERE provider_id = :pId", nativeQuery = true)
    List<Booking> findJobsByProviderId(@Param("pId") Long pId);
}