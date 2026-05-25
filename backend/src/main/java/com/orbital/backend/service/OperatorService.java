package com.orbital.backend.service;

import com.orbital.backend.dto.auth.OperatorResponse;

public interface OperatorService {
    OperatorResponse getProfile(String email);
}
