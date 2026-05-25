package com.orbital.backend.controller;

import com.orbital.backend.dto.auth.OperatorResponse;
import com.orbital.backend.dto.common.ApiResponse;
import com.orbital.backend.service.OperatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/operators")
public class OperatorController {

    private final OperatorService operatorService;

    public OperatorController(OperatorService operatorService) {
        this.operatorService = operatorService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<OperatorResponse>> profile(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(operatorService.getProfile(email)));
    }
}
