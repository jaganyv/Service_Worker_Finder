package com.servicefinder.service;

import com.servicefinder.dto.WorkerResponse;
import com.servicefinder.entity.Worker;
import com.servicefinder.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {
    @Autowired
    private WorkerRepository workerRepository;

    public List<WorkerResponse> getPendingWorkers() {
        // In a real app, you'd have a verified field. For now, return all workers
        List<Worker> workers = workerRepository.findAll();
        List<WorkerResponse> responses = new ArrayList<>();
        for (Worker worker : workers) {
            WorkerResponse response = new WorkerResponse();
            response.setId(worker.getId());
            response.setName(worker.getUser().getName());
            response.setEmail(worker.getUser().getEmail());
            response.setPhone(worker.getUser().getPhone());
            response.setServiceType(worker.getServiceType());
            response.setExperienceYears(worker.getExperienceYears());
            response.setPriceRange(worker.getPriceRange());
            response.setRating(worker.getRating());
            response.setAvailability(worker.getAvailability());
            responses.add(response);
        }
        return responses;
    }

    public Worker verifyWorker(Long workerId) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        // In a real app, you'd set a verified flag here
        return worker;
    }
}

