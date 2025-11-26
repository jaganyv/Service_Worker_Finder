package com.servicefinder.controller;

import com.servicefinder.dto.WorkerRegisterRequest;
import com.servicefinder.dto.WorkerResponse;
import com.servicefinder.entity.ServiceType;
import com.servicefinder.entity.Worker;
import com.servicefinder.security.JwtUtil;
import com.servicefinder.service.WorkerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workers")
@CrossOrigin(origins = "*")
public class WorkerController {
    @Autowired
    private WorkerService workerService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Worker> registerWorker(
            @Valid @RequestBody WorkerRegisterRequest request,
            HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        Worker worker = workerService.registerWorker(userId, request);
        return ResponseEntity.ok(worker);
    }

    @GetMapping
    public ResponseEntity<List<WorkerResponse>> getWorkers(
            @RequestParam(required = false) ServiceType service,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false, defaultValue = "50.0") Double radius) {
        List<WorkerResponse> workers;
        if (service != null) {
            workers = workerService.findWorkers(service, lat, lon, radius);
        } else {
            // Return all available workers if no service specified
            workers = workerService.findWorkers(null, lat, lon, radius);
        }
        return ResponseEntity.ok(workers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerResponse> getWorkerById(@PathVariable Long id) {
        WorkerResponse worker = workerService.getWorkerById(id);
        return ResponseEntity.ok(worker);
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Worker> updateAvailability(
            @PathVariable Long id,
            @RequestParam Boolean availability,
            HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        if (!userId.equals(id)) {
            return ResponseEntity.status(403).build();
        }
        Worker worker = workerService.updateAvailability(id, availability);
        return ResponseEntity.ok(worker);
    }
}

