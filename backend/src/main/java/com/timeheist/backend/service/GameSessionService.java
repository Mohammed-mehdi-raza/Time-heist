package com.timeheist.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.timeheist.backend.entity.GameSession;
import com.timeheist.backend.entity.GameMap;
import com.timeheist.backend.entity.User;
import com.timeheist.backend.repository.GameMapRepository;
import com.timeheist.backend.repository.GameSessionRepository;
import com.timeheist.backend.repository.UserRepository;
import com.timeheist.backend.exception.ResourceNotFoundException;
import com.timeheist.backend.dto.GameScoreResponse;

import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class GameSessionService {

	@Autowired
    private GameSessionRepository gameSessionRepository;
	@Autowired
    private GameMapRepository gameMapRepository;
	@Autowired
    private UserRepository userRepository;
	@Autowired
    private GameEventService gameEventService;

    @Transactional
    public GameSession startGame(Long userId, Long mapId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User with ID " + userId + " does not exist."
                        )
                );

        GameMap gameMap = gameMapRepository.findById(mapId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Game map with ID " + mapId + " does not exist."
                        )
                );

        if (!gameMap.getActive()) {
            throw new IllegalArgumentException(
                    "Game map with ID " + mapId + " is not active."
            );
        }

        GameSession session = new GameSession();

        session.setUser(user);
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

        LocalDateTime endedAt = LocalDateTime.now();
        session.setEndedAt(endedAt);
        session.setStatus("COMPLETED");

        GameScoreResponse score = gameEventService.calculateScore(sessionId);
        session.setFinalScore(score.getTotalScore());

        return gameSessionRepository.save(session);
    }
}
