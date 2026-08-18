package com.timeheist.backend.controller;



import com.timeheist.backend.dto.ApiResponse;
import com.timeheist.backend.entity.GameSession;
import com.timeheist.backend.service.GameSessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game/sessions")
public class GameSessionController {

	@Autowired
    private GameSessionService gameSessionService;


    // START GAME
    @PostMapping
    public ResponseEntity<ApiResponse<GameSession>> startGame(
            @RequestParam Long userId,
            @RequestParam Long mapId) {

        GameSession session =
                gameSessionService.startGame(userId, mapId);

        return ResponseEntity.ok(
                ApiResponse.<GameSession>builder()
                        .success(true)
                        .message("Game started successfully")
                        .data(session)
                        .build()
        );
    }


    // GET SESSION
    @GetMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<GameSession>> getGameSession(
            @PathVariable Long sessionId) {

        GameSession session =
                gameSessionService.getGameSession(sessionId);

        return ResponseEntity.ok(
                ApiResponse.<GameSession>builder()
                        .success(true)
                        .message("Game session fetched successfully")
                        .data(session)
                        .build()
        );
    }


    // FINISH GAME
    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<ApiResponse<GameSession>> finishGame(
            @PathVariable Long sessionId) {

        GameSession session =
                gameSessionService.finishGame(sessionId);

        return ResponseEntity.ok(
                ApiResponse.<GameSession>builder()
                        .success(true)
                        .message("Game finished successfully")
                        .data(session)
                        .build()
        );
    }
}