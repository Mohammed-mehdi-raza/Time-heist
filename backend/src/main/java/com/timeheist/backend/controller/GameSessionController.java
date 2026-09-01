package com.timeheist.backend.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timeheist.backend.dto.ApiResponse;
import com.timeheist.backend.entity.GameSession;
import com.timeheist.backend.service.GameSessionService;

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
                        @PathVariable Long sessionId,
                        @RequestParam String result) {

        GameSession session =
                                gameSessionService.finishGame(sessionId, result);

        return ResponseEntity.ok(
                ApiResponse.<GameSession>builder()
                        .success(true)
                        .message("Game finished successfully")
                        .data(session)
                        .build()
        );
    }
}