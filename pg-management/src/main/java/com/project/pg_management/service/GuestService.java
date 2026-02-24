package com.project.pg_management.service;

import com.project.pg_management.Payloads.GuestDto;
import com.project.pg_management.Payloads.RoomDto;
import com.project.pg_management.model.*;
import java.util.List;

public interface GuestService {
    GuestDto addGuest(Guest guest, int roomNumber);
    List<GuestDto> getAllGuests();
    GuestDto updateGuest(Guest guest, Long id);
    String deleteGuest(Long id);
    List<RoomDto> getAvailableRooms();
    List<GuestDto> getGuestByRoomNumber(int roomNumber);
    
    GuestDto updatePaymentStatus(Long guestId, String month, String status);
    GuestDto getGuestById(Long id);
    List<GuestDto> getDashboardStats();
}