package com.orbital.backend.controller;

import com.orbital.backend.dto.common.ApiResponse;
import com.orbital.backend.dto.common.MessageResponse;
import com.orbital.backend.dto.dashboard.ClientListResponse;
import com.orbital.backend.dto.dashboard.CreateClientRequest;
import com.orbital.backend.dto.dashboard.UpdateClientRequest;
import com.orbital.backend.service.DashboardCommandService;
import com.orbital.backend.service.DashboardReadService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final DashboardReadService dashboardReadService;
    private final DashboardCommandService dashboardCommandService;

    public ClientController(
            DashboardReadService dashboardReadService,
            DashboardCommandService dashboardCommandService) {
        this.dashboardReadService = dashboardReadService;
        this.dashboardCommandService = dashboardCommandService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientListResponse>>> list(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(dashboardReadService.listClients(email)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClientListResponse>> create(
            Authentication authentication,
            @Valid @RequestBody CreateClientRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(dashboardCommandService.createClient(email, request)));
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<ApiResponse<ClientListResponse>> update(
            Authentication authentication,
            @PathVariable Integer clientId,
            @Valid @RequestBody UpdateClientRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(
                dashboardCommandService.updateClient(email, clientId, request)));
    }

    @DeleteMapping("/{clientId}")
    public ResponseEntity<ApiResponse<MessageResponse>> delete(
            Authentication authentication,
            @PathVariable Integer clientId) {
        String email = authentication.getName();
        dashboardCommandService.deleteClient(email, clientId);
        return ResponseEntity.ok(ApiResponse.success(new MessageResponse("Cliente excluído com sucesso")));
    }
}
