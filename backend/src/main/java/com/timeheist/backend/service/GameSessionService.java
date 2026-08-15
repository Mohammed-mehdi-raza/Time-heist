package com.timeheist.backend.service;

import org.springframework.stereotype.Service;


import com.timeheist.backend.entity.GameSession;
import com.timeheist.backend.entity.GameMap;
import com.timeheist.backend.repository.GameMapRepository;
import com.timeheist.backend.repository.GameSessionRepository;
import com.timeheist.backend.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GameSessionService {

    private final GameSessionRepository gameSessionRepository;
    private final GameMapRepository gameMapRepository;

    @Transactional
    public GameSession startGame(Long userId, Long mapId) {

        GameMap gameMap = gameMapRepository.findById(mapId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Game map with ID " + mapId + " does not exist."
                        )
                );

        if (!Boolean.TRUE.equals(gameMap.getActive())) {
            throw new IllegalArgumentException(
                    "Game map with ID " + mapId + " is not active."
            );
        }

        /*
         * TODO:
         * Replace this with fetching the authenticated user
         * from Spring Security.
         *
         * For now this method expects userId.
         */

        GameSession session = new GameSession();

        // session.setUser(user);
        session.setMap(gameMap);
        session.setStartedAt(LocalDateTime.now());
        session.setStatus("RUNNING");
        session.setDiamondStolen(false);

        return gameSessionRepository.save(session);
    }

    @Transactional(readOnly = true)
    public GameSession getGameSession(Long sessionId) {

        return gameSessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Game session with ID " + sessionId
                                        + " does not exist."
                        )
                );
    }

    @Transactional
    public GameSession finishGame(Long sessionId) {

        GameSession session = gameSessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Game session with ID " + sessionId
                                        + " does not exist."
                        )
                );

        if (!"RUNNING".equals(session.getStatus())) {
            throw new IllegalStateException(
                    "Game session is already finished."
            );
        }

        session.setEndedAt(LocalDateTime.now());
        session.setStatus("COMPLETED");

        return gameSessionRepository.save(session);
    }
}
