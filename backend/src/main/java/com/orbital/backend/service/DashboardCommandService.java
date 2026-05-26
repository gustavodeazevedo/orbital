/*
 * Define como criar, editar e excluir dados do dashboard.
 * Usado nos controllers e feito por DashboardCommandServiceImpl.
 */
/*
 * Aqui ficam as acoes que mudam dados.
 * Centraliza o que grava no banco.
 */
package com.orbital.backend.service;

import com.orbital.backend.dto.dashboard.AppointmentListResponse;
import com.orbital.backend.dto.dashboard.ClientListResponse;
import com.orbital.backend.dto.dashboard.CreateAppointmentRequest;
import com.orbital.backend.dto.dashboard.CreateClientRequest;
import com.orbital.backend.dto.dashboard.CreateServiceRequest;
import com.orbital.backend.dto.dashboard.ServiceListResponse;
import com.orbital.backend.dto.dashboard.UpdateAppointmentRequest;
import com.orbital.backend.dto.dashboard.UpdateClientRequest;
import com.orbital.backend.dto.dashboard.UpdateServiceRequest;

public interface DashboardCommandService {

    ClientListResponse createClient(String operatorEmail, CreateClientRequest request);

    ClientListResponse updateClient(String operatorEmail, Integer clientId, UpdateClientRequest request);

    void deleteClient(String operatorEmail, Integer clientId);

    ServiceListResponse createService(String operatorEmail, CreateServiceRequest request);

    ServiceListResponse updateService(String operatorEmail, Integer serviceId, UpdateServiceRequest request);

    void deleteService(String operatorEmail, Integer serviceId);

    AppointmentListResponse createAppointment(String operatorEmail, CreateAppointmentRequest request);

    AppointmentListResponse updateAppointment(
            String operatorEmail,
            Integer appointmentId,
            UpdateAppointmentRequest request);
}
