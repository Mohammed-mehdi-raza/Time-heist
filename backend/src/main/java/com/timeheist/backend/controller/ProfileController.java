package com.timeheist.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timeheist.backend.dto.ApiResponse;
import com.timeheist.backend.dto.ProfileStatsResponse;
import com.timeheist.backend.dto.UpdateProfileRequest;
import com.timeheist.backend.entity.PlayerProfile;
import com.timeheist.backend.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService playerService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<PlayerProfile>> getPlayerByUserId(@PathVariable Long userId) {
        PlayerProfile playerProfile = playerService.getProfileForUser(userId);

        return ResponseEntity.ok(ApiResponse.<PlayerProfile>builder()
                .success(true)
                .message("Player profile fetched successfully")
                .data(playerProfile)
                .build());
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PlayerProfile>> createPlayer(@RequestBody UpdateProfileRequest request) {
        PlayerProfile createdPlayer = playerService.createPlayerForUser(
                request.getUserId(),
                request.getDisplayName(),
                request.getAvatar(),
                request.getBio()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.<PlayerProfile>builder()
                        .success(true)
                        .message("Player created successfully")
                        .data(createdPlayer)
                        .build());
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<PlayerProfile>> updatePlayer(@RequestBody UpdateProfileRequest request) {
        PlayerProfile updatedPlayer = playerService.updatePlayerForUser(
                request.getUserId(),
                request.getUsername(),
                request.getDisplayName(),
                request.getAvatar(),
                request.getBio()
        );

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.<PlayerProfile>builder()
                        .success(true)
                        .message("Player updated successfully")
                        .data(updatedPlayer)
                        .build());
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<ApiResponse<ProfileStatsResponse>> getPlayerStats(@PathVariable Long userId) {
        ProfileStatsResponse stats = playerService.getStatsForUser(userId);

        return ResponseEntity.ok(ApiResponse.<ProfileStatsResponse>builder()
                .success(true)
                .message("Player stats fetched successfully")
                .data(stats)
                .build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Player deleted successfully")
                .data(null)
                .build());
    }
}
