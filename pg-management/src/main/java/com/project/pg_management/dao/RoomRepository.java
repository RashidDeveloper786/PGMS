package com.project.pg_management.dao;

import com.project.pg_management.model.Room;
import org.springframework.data.jpa.repository.*;

import java.util.*;

public interface RoomRepository extends JpaRepository<Room, Integer> {
    Optional<Room> findByRoomNumber(int roomNumber);

    @Query("SELECT r FROM Room r WHERE SIZE(r.guests) < 2")
    List<Room> findAvailableRooms();
}
