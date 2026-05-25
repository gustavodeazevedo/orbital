package com.orbital.backend.service;

public interface EmailService {
    void sendPasswordResetEmail(String to, String operatorName, String resetLink);
}
