package com.project.pg_management.dao;

import com.project.pg_management.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    long countByRoom(Room room);
}
