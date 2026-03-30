package com.example.servicemate.controller;

import com.example.servicemate.entity.User;
import com.example.servicemate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "http://localhost:5173") // <-- THIS FIXES THE CONNECTION ERROR
public class ProviderController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/specialty/{type}")
    public List<User> getProviders(@PathVariable String type) {
        return userRepository.findByRoleIgnoreCaseAndServiceTypeIgnoreCase("provider", type).stream()
                .map(provider -> {
                    if (provider.getAvailability() == null) {
                        provider.setAvailability(Boolean.TRUE);
                        return userRepository.save(provider);
                    }
                    return provider;
                })
                .filter(provider -> Boolean.TRUE.equals(provider.getAvailability()))
                .collect(Collectors.toList());
    }
}
