package com.example.servicemate.controller;

import com.example.servicemate.entity.User;
import com.example.servicemate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "http://localhost:5173") // <-- THIS FIXES THE CONNECTION ERROR
public class ProviderController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/specialty/{type}")
    public List<User> getProviders(@PathVariable String type) {
        // Use the IgnoreCase method we added to UserRepository
        return userRepository.findByRoleIgnoreCaseAndServiceTypeIgnoreCase("provider", type);
    }
}