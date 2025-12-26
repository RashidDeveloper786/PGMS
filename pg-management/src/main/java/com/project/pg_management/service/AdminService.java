package com.project.pg_management.service;

public interface AdminService {
    String login(String email, String password);
    boolean validateToken(String token);
}
