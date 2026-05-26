/*
 * Rotas de servicos (/services).
 * Usa servicos de leitura e escrita do dashboard.
 */
/*
 * Recebe as acoes da tela de servicos.
 * Lista, cria e atualiza servicos no banco.
 */
package com.orbital.backend.controller;

import com.orbital.backend.dto.common.ApiResponse;
import com.orbital.backend.dto.common.MessageResponse;
import com.orbital.backend.dto.dashboard.CreateServiceRequest;
import com.orbital.backend.dto.dashboard.ServiceListResponse;
import com.orbital.backend.dto.dashboard.UpdateServiceRequest;
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
@RequestMapping("/services")
public class ServiceCatalogController {

    private final DashboardReadService dashboardReadService;
    private final DashboardCommandService dashboardCommandService;

    public ServiceCatalogController(
            DashboardReadService dashboardReadService,
            DashboardCommandService dashboardCommandService) {
        this.dashboardReadService = dashboardReadService;
        this.dashboardCommandService = dashboardCommandService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceListResponse>>> list(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(dashboardReadService.listServices(email)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceListResponse>> create(
            Authentication authentication,
            @Valid @RequestBody CreateServiceRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(dashboardCommandService.createService(email, request)));
    }

    @PutMapping("/{serviceId}")
    public ResponseEntity<ApiResponse<ServiceListResponse>> update(
            Authentication authentication,
            @PathVariable Integer serviceId,
            @Valid @RequestBody UpdateServiceRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success(
                dashboardCommandService.updateService(email, serviceId, request)));
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<ApiResponse<MessageResponse>> delete(
            Authentication authentication,
            @PathVariable Integer serviceId) {
        String email = authentication.getName();
        dashboardCommandService.deleteService(email, serviceId);
        return ResponseEntity.ok(ApiResponse.success(new MessageResponse("Serviço excluído com sucesso")));
    }
}
