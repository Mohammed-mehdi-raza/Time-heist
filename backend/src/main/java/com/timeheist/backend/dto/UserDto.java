package com.timeheist.backend.dto;

import java.time.LocalDateTime;

import com.timeheist.backend.entity.PlayerProfile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
	
    private Long id;
    private String username;
    private String email;
}
