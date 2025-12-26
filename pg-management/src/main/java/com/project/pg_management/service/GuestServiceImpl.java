package com.project.pg_management.service;

import com.project.pg_management.Payloads.GuestDto;
import com.project.pg_management.Payloads.RoomDto;
import com.project.pg_management.dao.*;
import com.project.pg_management.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GuestServiceImpl implements GuestService {

    @Autowired
    private GuestRepository guestRepo;
    @Autowired
    private RoomRepository roomRepo;

    @Override
    public GuestDto addGuest(Guest guest, int roomNumber) {
        Room room = roomRepo.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (guestRepo.countByRoom(room) >= 2) {
            throw new RuntimeException("Room is full");
        }

        guest.setRoom(room);
        Guest guest2 = guestRepo.save(guest);

        return convertToGuestDto(guest2);

    }

    @Override
    public List<GuestDto> getGuestByRoomNumber(int roomNumber) {
        Room room = roomRepo.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        List<Guest> guests = room.getGuests(); // get guests directly from Room entity

        List<GuestDto> guestDtos = guests.stream().map(guest -> convertToGuestDto(guest)).collect(Collectors.toList());
        return guestDtos;
    }

    @Override
    public List<GuestDto> getAllGuests() {
        List<Guest> guests = guestRepo.findAll();
        List<GuestDto> guestDtos = guests.stream().map(guest -> convertToGuestDto(guest)).collect(Collectors.toList());
        return guestDtos;
    }

    @Override
    public GuestDto updateGuest(Guest guest, Long roomNumber) {
        Guest guest2 = guestRepo.findById(roomNumber).orElseThrow(() -> new RuntimeException("Guest Not Found"));

        GuestDto guestDto = convertToGuestDto(guest2);
        return guestDto;
    }

    @Override
    public String deleteGuest(Long id) {
        guestRepo.findById(id).orElseThrow(() -> new RuntimeException("Guest not found"));

        guestRepo.deleteById(id);

        return "Guest with id : " + id + " deleted successfully.";
    }

    @Override
    public List<RoomDto> getAvailableRooms() {
        List<Room> rooms = roomRepo.findAvailableRooms();
        List<RoomDto> roomDtos = rooms.stream().map(this::convertToRoomDto).collect(Collectors.toList());
        return roomDtos;
    }



    // Add these methods to GuestServiceImpl class

@Override
public GuestDto updatePaymentStatus(Long guestId, String month, String status) {
    Guest guest = guestRepo.findById(guestId)
            .orElseThrow(() -> new RuntimeException("Guest not found"));
    guest.setPaymentStatus(status);
    Guest updatedGuest = guestRepo.save(guest);
    return convertToGuestDto(updatedGuest);
}

@Override
public GuestDto getGuestById(Long id) {
    Guest guest = guestRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Guest not found"));
    return convertToGuestDto(guest);
}

@Override
public List<GuestDto> getDashboardStats() {
    // This returns all guests for dashboard
    return getAllGuests();
}


    // Manual Model Mapper
    // Update the convertToGuestDto method in GuestServiceImpl.java
    public GuestDto convertToGuestDto(Guest guest) {
        GuestDto dto = new GuestDto();
        dto.setId(guest.getId());
        dto.setName(guest.getName());
        dto.setEmail(guest.getEmail());
        dto.setPhone(guest.getPhone());
        dto.setRoomNumber(guest.getRoom() != null ? guest.getRoom().getRoomNumber() : null);
        dto.setPaymentStatus(guest.getPaymentStatus()); // Added this line

        if (guest.getAdmitDate() != null) {
            dto.setAdmitDate(guest.getAdmitDate().toString());
        } else {
            dto.setAdmitDate(null);
        }
        return dto;
    }

    private RoomDto convertToRoomDto(Room room) {
        RoomDto dto = new RoomDto();
        dto.setRoomNumber(room.getRoomNumber());

        // Avoid recursive nesting
        List<GuestDto> guestDtos = room.getGuests().stream()
                .map(guest -> {
                    GuestDto g = new GuestDto();
                    g.setId(guest.getId());
                    g.setName(guest.getName());
                    g.setEmail(guest.getEmail());
                    g.setPhone(guest.getPhone());
                    g.setRoomNumber(null);
                    return g;
                })
                .toList();

        dto.setGuests(guestDtos);
        return dto;
    }

}
