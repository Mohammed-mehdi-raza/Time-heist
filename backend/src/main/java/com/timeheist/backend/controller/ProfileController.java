package com.timeheist.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.timeheist.backend.dto.ApiResponse;
import com.timeheist.backend.entity.PlayerProfile;
import com.timeheist.backend.service.ProfileService;

@RestController("/player")
public class ProfileController {

    @Autowired
    private ProfileService playerService;
    
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PlayerProfile>> createPlayer(@RequestBody PlayerProfile player) {

        PlayerProfile createdPlayer = playerService.createPlayer(player);

        ApiResponse<PlayerProfile> response = ApiResponse.<PlayerProfile>builder()
                .success(true)
                .message("Player created successfully")
                .data(createdPlayer)
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<PlayerProfile>> updatePlayer(@RequestBody PlayerProfile player) {

        PlayerProfile updatedPlayer = playerService.updatePlayer(player);

        ApiResponse<PlayerProfile> response = ApiResponse.<PlayerProfile>builder()
                .success(true)
                .message("Player updated successfully")
                .data(updatedPlayer)
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlayer(@PathVariable Long id) {

        playerService.deletePlayer(id);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Player deleted successfully")
                .data(null)
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }   


}
