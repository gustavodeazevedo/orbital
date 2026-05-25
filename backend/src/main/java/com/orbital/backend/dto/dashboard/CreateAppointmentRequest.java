package com.orbital.backend.dto.dashboard;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class CreateAppointmentRequest {

    @NotNull(message = "é obrigatório")
    private Integer clientId;

    @NotNull(message = "é obrigatório")
    private Integer serviceId;

    @NotNull(message = "é obrigatória")
    @Future(message = "deve ser uma data/hora futura")
    private LocalDateTime scheduledAt;

    @NotBlank(message = "é obrigatório")
    private String status;

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public Integer getServiceId() {
        return serviceId;
    }

    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
