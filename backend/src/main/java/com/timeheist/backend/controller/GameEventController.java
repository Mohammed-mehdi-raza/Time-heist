package com.timeheist.backend.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timeheist.backend.dto.ApiResponse;
import com.timeheist.backend.dto.CreateGameEventRequest;
import com.timeheist.backend.dto.GameEventStatsResponse;
import com.timeheist.backend.dto.GameScoreResponse;
import com.timeheist.backend.entity.GameEvent;
import com.timeheist.backend.service.GameEventService;
import com.timeheist.backend.service.GameSessionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/game/sessions")
@RequiredArgsConstructor
public class GameEventController {

    private final GameEventService gameEventService;
        private final GameSessionService gameSessionService;


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

        if (gameSessionService.getGameSession(sessionId).getFinalScore() == null) {
            throw new IllegalStateException(
                    "A score is only available for won game sessions."
            );
        }

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