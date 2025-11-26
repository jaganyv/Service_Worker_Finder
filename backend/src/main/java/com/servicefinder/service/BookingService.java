package com.servicefinder.service;

import com.servicefinder.dto.BookingRequest;
import com.servicefinder.dto.BookingResponse;
import com.servicefinder.entity.Booking;
import com.servicefinder.entity.BookingStatus;
import com.servicefinder.entity.User;
import com.servicefinder.entity.Worker;
import com.servicefinder.repository.BookingRepository;
import com.servicefinder.repository.UserRepository;
import com.servicefinder.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WhatsAppService whatsAppService;

    @Transactional
    public BookingResponse createBooking(Long customerId, BookingRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Worker worker = workerRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        if (!worker.getAvailability()) {
            throw new RuntimeException("Worker is not available");
        }

        Booking booking = new Booking();
        booking.setWorker(worker);
        booking.setCustomer(customer);
        booking.setDate(request.getDate());
        booking.setTime(request.getTime());
        booking.setStatus(BookingStatus.PENDING);

        booking = bookingRepository.save(booking);

        // Send WhatsApp notification to worker
        String message = String.format("New booking request from %s for %s on %s at %s",
                customer.getName(), worker.getServiceType(), request.getDate(), request.getTime());
        whatsAppService.sendMessage(worker.getUser().getPhone(), message);

        return mapToResponse(booking);
    }

    public List<BookingResponse> getCustomerBookings(Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Booking> bookings = bookingRepository.findByCustomer(customer);
        List<BookingResponse> responses = new ArrayList<>();
        for (Booking booking : bookings) {
            responses.add(mapToResponse(booking));
        }
        return responses;
    }

    public List<BookingResponse> getWorkerBookings(Long workerId) {
        List<Booking> bookings = bookingRepository.findByWorkerId(workerId);
        List<BookingResponse> responses = new ArrayList<>();
        for (Booking booking : bookings) {
            responses.add(mapToResponse(booking));
        }
        return responses;
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, Long workerId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getWorker().getId().equals(workerId)) {
            throw new RuntimeException("Unauthorized");
        }

        booking.setStatus(status);
        booking = bookingRepository.save(booking);

        // Send WhatsApp notification to customer
        String statusMessage = status == BookingStatus.ACCEPTED ? "accepted" : "rejected";
        String message = String.format("Your booking for %s on %s at %s has been %s by %s",
                booking.getWorker().getServiceType(), booking.getDate(), booking.getTime(),
                statusMessage, booking.getWorker().getUser().getName());
        whatsAppService.sendMessage(booking.getCustomer().getPhone(), message);

        return mapToResponse(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setWorkerId(booking.getWorker().getId());
        response.setWorkerName(booking.getWorker().getUser().getName());
        response.setWorkerPhone(booking.getWorker().getUser().getPhone());
        response.setServiceType(booking.getWorker().getServiceType());
        response.setCustomerId(booking.getCustomer().getId());
        response.setCustomerName(booking.getCustomer().getName());
        response.setCustomerPhone(booking.getCustomer().getPhone());
        response.setDate(booking.getDate());
        response.setTime(booking.getTime());
        response.setStatus(booking.getStatus());
        response.setCreatedAt(booking.getCreatedAt());
        return response;
    }
}

