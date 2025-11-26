package com.servicefinder.controller;

import com.servicefinder.dto.WorkerResponse;
import com.servicefinder.entity.Worker;
import com.servicefinder.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/workers/pending")
    public ResponseEntity<List<WorkerResponse>> getPendingWorkers() {
        List<WorkerResponse> workers = adminService.getPendingWorkers();
        return ResponseEntity.ok(workers);
    }

    @PutMapping("/workers/{id}/verify")
    public ResponseEntity<Worker> verifyWorker(@PathVariable Long id) {
        Worker worker = adminService.verifyWorker(id);
        return ResponseEntity.ok(worker);
    }
}

