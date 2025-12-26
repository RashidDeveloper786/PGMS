package com.project.pg_management.controller;

import com.project.pg_management.Payloads.GuestDto;
import com.project.pg_management.Payloads.RoomDto;
import com.project.pg_management.model.Guest;
import com.project.pg_management.service.AdminService;
import com.project.pg_management.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
@CrossOrigin(origins = "http://localhost:3000")
public class GuestController {

    @Autowired
    private GuestService guestService;

    @Autowired
    private AdminService adminService;

    private boolean isAuthorized(String token) {
        return adminService.validateToken(token);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addGuest(@RequestHeader("Authorization") String token,
                                      @RequestParam int roomNumber,
                                      @RequestBody Guest guest) {
        if (!isAuthorized(token)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        try {
            GuestDto savedGuest = guestService.addGuest(guest, roomNumber);
            return ResponseEntity.ok(savedGuest); 
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllGuests(@RequestHeader("Authorization") String token) {
        if (!isAuthorized(token)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        List<GuestDto> guests = guestService.getAllGuests();
        if (guests == null || guests.isEmpty()) {
            return ResponseEntity.ok("No Guests Found");
        }
        return ResponseEntity.ok(guests);
    }
    

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getGuestByRoomNumber(@RequestHeader("Authorization") String token, 
                                                  @PathVariable int roomId){
        if (!isAuthorized(token)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        List<GuestDto> guestDtos = guestService.getGuestByRoomNumber(roomId);
        return ResponseEntity.ok(guestDtos);
    }

    @GetMapping("/guest/{id}")
    public ResponseEntity<?> getGuestById(@RequestHeader("Authorization") String token,
                                          @PathVariable Long id) {
        if (!isAuthorized(token)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        try {
            GuestDto guest = guestService.getGuestById(id);
            return ResponseEntity.ok(guest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateGuest(@RequestHeader("Authorization") String token, 
                                         @RequestBody Guest guest, 
                                         @PathVariable Long id){
        if (!isAuthorized(token)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        try {
            GuestDto guestDto = guestService.updateGuest(guest, id);
            return ResponseEntity.ok(guestDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteGuest(@RequestHeader("Authorization") String token,
                                         @PathVariable Long id) {
        if (!isAuthorized(token)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        try {
            String msg = guestService.deleteGuest(id);
            return ResponseEntity.ok(msg);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/available-rooms")
    public ResponseEntity<?> getAvailableRooms(@RequestHeader("Authorization") String token) {
        if (!isAuthorized(token)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        List<RoomDto> rooms = guestService.getAvailableRooms();
        return ResponseEntity.ok(rooms);
    }

    @PostMapping("/{id}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(@RequestHeader("Authorization") String token,
                                                 @PathVariable Long id,
                                                 @RequestParam String month,
                                                 @RequestParam String status) {
        if (!isAuthorized(token)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        try {
            GuestDto updatedGuest = guestService.updatePaymentStatus(id, month, status);
            return ResponseEntity.ok(updatedGuest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(@RequestHeader("Authorization") String token) {
        if (!isAuthorized(token)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        try {
            List<GuestDto> guests = guestService.getAllGuests();
            return ResponseEntity.ok(guests);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}