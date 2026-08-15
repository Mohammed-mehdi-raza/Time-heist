package com.timeheist.backend.controller;


import com.timeheist.backend.dto.ApiResponse;
import com.timeheist.backend.dto.CreateGameEventRequest;
import com.timeheist.backend.dto.GameEventStatsResponse;
import com.timeheist.backend.dto.GameScoreResponse;
import com.timeheist.backend.entity.GameEvent;
import com.timeheist.backend.service.GameEventService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game/sessions")
@RequiredArgsConstructor
public class GameEventController {

    private final GameEventService gameEventService;


    // CREATE GAME EVENT
    @PostMapping("/{sessionId}/events")
    public ResponseEntity<ApiResponse<GameEvent>> createEvent(
            @PathVariable Long sessionId,
            @Valid @RequestBody CreateGameEventRequest request) {

        GameEvent event =
                gameEventService.createEvent(
                        sessionId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.<GameEvent>builder()
                        .success(true)
                        .message("Game event recorded successfully")
                        .data(event)
                        .build()
        );
    }


    // GET EVENT STATISTICS
    @GetMapping("/{sessionId}/events/stats")
    public ResponseEntity<ApiResponse<GameEventStatsResponse>> getEventStats(
            @PathVariable Long sessionId) {

        GameEventStatsResponse stats =
                gameEventService.getEventStats(sessionId);

        return ResponseEntity.ok(
                ApiResponse.<GameEventStatsResponse>builder()
                        .success(true)
                        .message("Game event statistics fetched successfully")
                        .data(stats)
                        .build()
        );
    }


    // GET SCORE
    @GetMapping("/{sessionId}/events/score")
    public ResponseEntity<ApiResponse<GameScoreResponse>> getScore(
            @PathVariable Long sessionId) {

        GameScoreResponse score =
                gameEventService.calculateScore(sessionId);

        return ResponseEntity.ok(
                ApiResponse.<GameScoreResponse>builder()
                        .success(true)
                        .message("Game score calculated successfully")
                        .data(score)
                        .build()
        );
    }
}