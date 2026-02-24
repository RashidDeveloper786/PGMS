package com.project.pg_management.Payloads;

import lombok.Data;

@Data
public class GuestDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Integer roomNumber; 
    private String admitDate;
    private String paymentStatus = "pending"; 
}