package com.project.pg_management.model;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private LocalDate admitDate;
    private String paymentStatus = "pending"; 

    @ManyToOne
    @JoinColumn(name = "room_id")
    @ToString.Exclude
    @JsonBackReference
    private Room room;

    @PrePersist
    public void prePersist() {
        this.admitDate = LocalDate.now();
        if (this.paymentStatus == null) {
            this.paymentStatus = "pending";
        }
    }
}