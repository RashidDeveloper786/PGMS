package com.project.pg_management.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
public class Room {
    @Id
    private int roomNumber;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)

    @JsonManagedReference
    @ToString.Exclude
    private List<Guest> guests = new ArrayList<>();
}
