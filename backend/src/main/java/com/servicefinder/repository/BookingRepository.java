package com.servicefinder.repository;

import com.servicefinder.entity.Booking;
import com.servicefinder.entity.BookingStatus;
import com.servicefinder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer(User customer);
    List<Booking> findByWorkerId(Long workerId);
    List<Booking> findByWorkerIdAndStatus(Long workerId, BookingStatus status);
}

