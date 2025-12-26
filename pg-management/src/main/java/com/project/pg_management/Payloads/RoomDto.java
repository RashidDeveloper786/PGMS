package com.project.pg_management.Payloads;

import lombok.Data;

import java.util.*;

@Data
public class RoomDto {
    private int roomNumber;
    private List<GuestDto> guests = new ArrayList<>();
}
