package com.project.pg_management.service;

import com.project.pg_management.dao.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    

    @Autowired
    private AdminRepository adminRepo;

    private static final String TOKEN = "Rashid";

    @Override
    public String login(String email, String password) {
        return adminRepo.findByEmailAndPassword(email, password).isPresent() ? TOKEN : null;
    }

    @Override
    public boolean validateToken(String token) {
        return TOKEN.equals(token);
    }
}
