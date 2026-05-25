package com.orbital.backend.controller;

import com.orbital.backend.dto.common.ApiResponse;
import com.orbital.backend.dto.dashboard.AppointmentListResponse;
import com.orbital.backend.dto.dashboard.CreateAppointmentRequest;
import com.orbital.backend.dto.dashboard.UpdateAppointmentRequest;
import com.orbital.backend.service.DashboardCommandService;
import com.orbital.backend.service.DashboardReadService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final DashboardReadService dashboardReadService;
    private final DashboardCommandService dashboardCommandService;

    public AppointmentController(
            DashboardReadService dashboardReadService,
            DashboardCommandService dashboardCommandService) {
        this.dashboardReadService = dashboardReadService;
        this.dashboardCommandService = dashboardCommandService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentListResponse>>> list(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(dashboardReadService.listAppointments(email, from, to)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentListResponse>> create(
            Authentication authentication,
            @Valid @RequestBody CreateAppointmentRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(dashboardCommandService.createAppointment(email, request)));
    }

    @PutMapping("/{appointmentId}")
    public ResponseEntity<ApiResponse<AppointmentListResponse>> update(
            Authentication authentication,
            @PathVariable Integer appointmentId,
            @Valid @RequestBody UpdateAppointmentRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(
                dashboardCommandService.updateAppointment(email, appointmentId, request)));
    }
}
