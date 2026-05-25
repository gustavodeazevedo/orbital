package com.orbital.backend.service;

import com.orbital.backend.dto.dashboard.AppointmentListResponse;
import com.orbital.backend.dto.dashboard.ClientListResponse;
import com.orbital.backend.dto.dashboard.ServiceListResponse;

import java.time.LocalDate;
import java.util.List;

public interface DashboardReadService {

    List<ClientListResponse> listClients(String operatorEmail);

    List<ServiceListResponse> listServices(String operatorEmail);

    List<AppointmentListResponse> listAppointments(String operatorEmail, LocalDate from, LocalDate to);
}
