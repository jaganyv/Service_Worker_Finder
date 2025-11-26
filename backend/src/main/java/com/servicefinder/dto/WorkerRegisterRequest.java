package com.servicefinder.dto;

import com.servicefinder.entity.ServiceType;
import jakarta.validation.constraints.NotNull;

public class WorkerRegisterRequest {
    @NotNull
    private ServiceType serviceType;
    
    private Integer experienceYears;
    private String priceRange;

    // Getters and Setters
    public ServiceType getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getPriceRange() {
        return priceRange;
    }

    public void setPriceRange(String priceRange) {
        this.priceRange = priceRange;
    }
}

