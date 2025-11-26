package com.servicefinder.controller;

import com.servicefinder.dto.BookingRequest;
import com.servicefinder.dto.BookingResponse;
import com.servicefinder.entity.BookingStatus;
import com.servicefinder.security.JwtUtil;
import com.servicefinder.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = authHeader.substring(7);
        Long customerId = jwtUtil.extractUserId(token);
        BookingResponse booking = bookingService.createBooking(customerId, request);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/customer")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = authHeader.substring(7);
        Long customerId = jwtUtil.extractUserId(token);
        List<BookingResponse> bookings = bookingService.getCustomerBookings(customerId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/worker")
    public ResponseEntity<List<BookingResponse>> getWorkerBookings(HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = authHeader.substring(7);
        Long workerId = jwtUtil.extractUserId(token);
        List<BookingResponse> bookings = bookingService.getWorkerBookings(workerId);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status,
            HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = authHeader.substring(7);
        Long workerId = jwtUtil.extractUserId(token);
        BookingResponse booking = bookingService.updateBookingStatus(id, workerId, status);
        return ResponseEntity.ok(booking);
    }
}

