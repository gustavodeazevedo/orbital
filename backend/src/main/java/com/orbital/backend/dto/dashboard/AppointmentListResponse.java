package com.orbital.backend.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AppointmentListResponse {

    private final Integer id;
    private final Integer clientId;
    private final String clientName;
    private final Integer serviceId;
    private final String serviceName;
    private final Integer serviceDurationMinutes;
    private final BigDecimal servicePrice;
    private final LocalDateTime scheduledAt;
    private final String status;

    public AppointmentListResponse(
            Integer id,
            Integer clientId,
            String clientName,
            Integer serviceId,
            String serviceName,
            Integer serviceDurationMinutes,
            BigDecimal servicePrice,
            LocalDateTime scheduledAt,
            String status) {
        this.id = id;
        this.clientId = clientId;
        this.clientName = clientName;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.serviceDurationMinutes = serviceDurationMinutes;
        this.servicePrice = servicePrice;
        this.scheduledAt = scheduledAt;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public Integer getClientId() {
        return clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public Integer getServiceId() {
        return serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public Integer getServiceDurationMinutes() {
        return serviceDurationMinutes;
    }

    public BigDecimal getServicePrice() {
        return servicePrice;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public String getStatus() {
        return status;
    }
}
