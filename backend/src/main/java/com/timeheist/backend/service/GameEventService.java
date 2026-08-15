package com.timeheist.backend.service;



import com.timeheist.backend.exception.ResourceNotFoundException;
import com.timeheist.backend.constants.GameEventConstants;
import com.timeheist.backend.dto.CreateGameEventRequest;
import com.timeheist.backend.dto.GameEventStatsResponse;
import com.timeheist.backend.dto.GameScoreResponse;
import com.timeheist.backend.entity.GameEvent;
import com.timeheist.backend.entity.GameObject;
import com.timeheist.backend.entity.GameSession;
import com.timeheist.backend.repository.GameEventRepository;
import com.timeheist.backend.repository.GameObjectRepository;
import com.timeheist.backend.repository.GameSessionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameEventService {

    private final GameEventRepository gameEventRepository;
    private final GameSessionRepository gameSessionRepository;
    private final GameObjectRepository gameObjectRepository;


    // --------------------------------------------------
    // CREATE EVENT
    // --------------------------------------------------

    @Transactional
    public GameEvent createEvent(
            Long sessionId,
            CreateGameEventRequest request) {

        GameSession session = getSession(sessionId);

        if (!"RUNNING".equals(session.getStatus())) {
            throw new IllegalStateException(
                    "Cannot create event for a finished game."
            );
        }

        validateEventType(request.getEventType());

        GameEvent event = new GameEvent();

        event.setGameSession(session);
        event.setEventType(request.getEventType());
        event.setEventTime(LocalDateTime.now());
        event.setMetadata(request.getMetadata());

        if (request.getObjectId() != null) {

            GameObject gameObject = gameObjectRepository
                    .findById(request.getObjectId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Game object with ID "
                                            + request.getObjectId()
                                            + " does not exist."
                            )
                    );

            event.setGameObject(gameObject);
        }

        /*
         * If diamond is stolen, update session state.
         */
        if (GameEventConstants.DIAMOND_STOLEN
                .equals(request.getEventType())) {

            session.setDiamondStolen(true);
            gameSessionRepository.save(session);
        }

        return gameEventRepository.save(event);
    }


    // --------------------------------------------------
    // GET EVENT STATS
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public GameEventStatsResponse getEventStats(Long sessionId) {

        getSession(sessionId);

        List<GameEvent> events =
                gameEventRepository.findByGameSessionId(sessionId);

        GameEventStatsResponse stats =
                new GameEventStatsResponse();

        for (GameEvent event : events) {

            switch (event.getEventType()) {

                case GameEventConstants.CCTV_CAUGHT ->
                        stats.setCctvCaught(
                                stats.getCctvCaught() + 1
                        );

                case GameEventConstants.LASER_TRIGGERED ->
                        stats.setLaserTriggered(
                                stats.getLaserTriggered() + 1
                        );

                case GameEventConstants.HOLE_TRIGGERED ->
                        stats.setHolesTriggered(
                                stats.getHolesTriggered() + 1
                        );

                case GameEventConstants.SPIKE_HIT ->
                        stats.setSpikesHit(
                                stats.getSpikesHit() + 1
                        );

                case GameEventConstants.DIAMOND_STOLEN ->
                        stats.setDiamondStolen(
                                stats.getDiamondStolen() + 1
                        );

                case GameEventConstants.GUARD_CAUGHT ->
                        stats.setGuardCaught(
                                stats.getGuardCaught() + 1
                        );

                case GameEventConstants.ESCAPE ->
                        stats.setEscape(
                                stats.getEscape() + 1
                        );
            }
        }

        return stats;
    }


    // --------------------------------------------------
    // CALCULATE SCORE
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public GameScoreResponse calculateScore(Long sessionId) {

        GameSession session = getSession(sessionId);

        if (session.getStartedAt() == null) {
            throw new IllegalStateException(
                    "Game session does not have a start time."
            );
        }

        if (session.getEndedAt() == null) {
            throw new IllegalStateException(
                    "Game session has not ended yet."
            );
        }

        GameEventStatsResponse stats =
                getEventStats(sessionId);

        long durationSeconds =
                Duration.between(
                        session.getStartedAt(),
                        session.getEndedAt()
                ).getSeconds();

        int score = calculateTotalScore(
                durationSeconds,
                stats
        );

        GameScoreResponse response =
                new GameScoreResponse();

        response.setStartTime(session.getStartedAt());
        response.setEndTime(session.getEndedAt());
        response.setDurationSeconds(durationSeconds);

        response.setCctvCaught(stats.getCctvCaught());
        response.setLaserTriggered(stats.getLaserTriggered());
        response.setHolesTriggered(stats.getHolesTriggered());
        response.setSpikesHit(stats.getSpikesHit());
        response.setDiamondStolen(stats.getDiamondStolen());

        response.setTotalScore(score);

        return response;
    }


    // --------------------------------------------------
    // SCORE FORMULA
    // --------------------------------------------------

    private int calculateTotalScore(
            long durationSeconds,
            GameEventStatsResponse stats) {

        /*
         * Example scoring system.
         *
         * Base score:
         * 1000
         *
         * Time penalty:
         * 2 points per second
         *
         * CCTV:
         * -100 each
         *
         * Laser:
         * -50 each
         *
         * Hole:
         * -100 each
         *
         * Spike:
         * -500 each
         *
         * Diamond:
         * +500
         */

        int score = 1000;

        score -= (int) durationSeconds * 2;

        score -= (int) stats.getCctvCaught() * 100;

        score -= (int) stats.getLaserTriggered() * 50;

        score -= (int) stats.getHolesTriggered() * 100;

        score -= (int) stats.getSpikesHit() * 500;

        score += (int) stats.getDiamondStolen() * 500;

        return Math.max(score, 0);
    }


    // --------------------------------------------------
    // HELPERS
    // --------------------------------------------------

    private GameSession getSession(Long sessionId) {

        return gameSessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Game session with ID " + sessionId
                                        + " does not exist."
                        )
                );
    }


    private void validateEventType(String eventType) {

        if (!GameEventConstants.DIAMOND_STOLEN.equals(eventType)
                && !GameEventConstants.CCTV_CAUGHT.equals(eventType)
                && !GameEventConstants.LASER_TRIGGERED.equals(eventType)
                && !GameEventConstants.HOLE_TRIGGERED.equals(eventType)
                && !GameEventConstants.SPIKE_HIT.equals(eventType)
                && !GameEventConstants.GUARD_CAUGHT.equals(eventType)
                && !GameEventConstants.ESCAPE.equals(eventType)) {

            throw new IllegalArgumentException(
                    "Invalid game event type: " + eventType
            );
        }
    }
}
