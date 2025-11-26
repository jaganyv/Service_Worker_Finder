package com.servicefinder.controller;

import com.servicefinder.dto.AuthResponse;
import com.servicefinder.dto.LoginRequest;
import com.servicefinder.dto.RegisterRequest;
import com.servicefinder.entity.Role;
import com.servicefinder.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request, Role.CUSTOMER);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/worker")
    public ResponseEntity<AuthResponse> registerWorker(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request, Role.WORKER);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}

