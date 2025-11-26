package com.servicefinder.service;

import com.servicefinder.dto.WorkerRegisterRequest;
import com.servicefinder.dto.WorkerResponse;
import com.servicefinder.entity.ServiceType;
import com.servicefinder.entity.User;
import com.servicefinder.entity.Worker;
import com.servicefinder.repository.UserRepository;
import com.servicefinder.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class WorkerService {
    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Worker registerWorker(Long userId, WorkerRegisterRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != com.servicefinder.entity.Role.WORKER) {
            throw new RuntimeException("User is not a worker");
        }

        if (workerRepository.findById(userId).isPresent()) {
            throw new RuntimeException("Worker profile already exists");
        }

        Worker worker = new Worker();
        worker.setId(userId);
        worker.setUser(user);
        worker.setServiceType(request.getServiceType());
        worker.setExperienceYears(request.getExperienceYears());
        worker.setPriceRange(request.getPriceRange());
        worker.setRating(BigDecimal.ZERO);
        worker.setAvailability(true);

        return workerRepository.save(worker);
    }

    public List<WorkerResponse> findWorkers(ServiceType serviceType, Double lat, Double lon, Double radius) {
        List<WorkerResponse> responses = new ArrayList<>();

        if (serviceType == null) {
            // Return all available workers
            List<Worker> workers = workerRepository.findAll().stream()
                    .filter(w -> w.getAvailability())
                    .toList();
            for (Worker worker : workers) {
                responses.add(mapToResponse(worker, null));
            }
            return responses;
        }

        if (lat != null && lon != null && radius != null) {
            // Use Haversine query for geo-based search
            List<Object[]> results = workerRepository.findWorkersNearby(
                    lat, lon, serviceType.name(), radius
            );

            for (Object[] row : results) {
                Long workerId = ((Number) row[0]).longValue();
                Double distance = ((Number) row[1]).doubleValue();
                Worker worker = workerRepository.findById(workerId)
                        .orElse(null);
                if (worker != null) {
                    WorkerResponse response = mapToResponse(worker, distance);
                    responses.add(response);
                }
            }
        } else {
            // Simple search without location
            List<Worker> workers = workerRepository.findByServiceTypeAndAvailability(serviceType, true);
            for (Worker worker : workers) {
                responses.add(mapToResponse(worker, null));
            }
        }

        return responses;
    }

    public WorkerResponse getWorkerById(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        return mapToResponse(worker, null);
    }

    public Worker updateAvailability(Long workerId, Boolean availability) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        worker.setAvailability(availability);
        return workerRepository.save(worker);
    }

    private WorkerResponse mapToResponse(Worker worker, Double distance) {
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
        response.setLat(worker.getUser().getLat());
        response.setLon(worker.getUser().getLon());
        response.setDistance(distance);
        return response;
    }
}

