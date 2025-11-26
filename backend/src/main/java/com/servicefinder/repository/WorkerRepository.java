package com.servicefinder.repository;

import com.servicefinder.entity.ServiceType;
import com.servicefinder.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findByServiceTypeAndAvailability(ServiceType serviceType, Boolean availability);
    
    @Query(value = "SELECT w.id, " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(u.lat)) * " +
            "cos(radians(u.lon) - radians(:lon)) + " +
            "sin(radians(:lat)) * sin(radians(u.lat)))) AS distance " +
            "FROM workers w " +
            "INNER JOIN users u ON w.id = u.id " +
            "WHERE w.service_type = :serviceType " +
            "AND w.availability = true " +
            "AND u.lat IS NOT NULL AND u.lon IS NOT NULL " +
            "HAVING distance <= :radius " +
            "ORDER BY distance ASC", nativeQuery = true)
    List<Object[]> findWorkersNearby(
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("serviceType") String serviceType,
            @Param("radius") Double radius
    );
    
    Optional<Worker> findById(Long id);
}

