package com.timeheist.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.timeheist.backend.dto.ProfileStatsResponse;
import com.timeheist.backend.entity.GameSession;
import com.timeheist.backend.entity.User;
import com.timeheist.backend.repository.GameSessionRepository;
import com.timeheist.backend.repository.ProfileRepo;
import com.timeheist.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepo profileRepo;

    @Mock
    private GameSessionRepository gameSessionRepository;

    @Mock
    private UserRepository userRepository;

    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        profileService = new ProfileService(profileRepo, gameSessionRepository, userRepository);
    }

    @Test
    void shouldCalculateUserStatsFromGameSessions() {
        User user = new User();
        user.setId(7L);

        GameSession session1 = new GameSession();
        session1.setUser(user);
        session1.setStatus("COMPLETED");
        session1.setDiamondStolen(true);
        session1.setStartedAt(LocalDateTime.of(2026, 1, 1, 10, 0));
        session1.setEndedAt(LocalDateTime.of(2026, 1, 1, 10, 4));
        session1.setFinalScore(18000);

        GameSession session2 = new GameSession();
        session2.setUser(user);
        session2.setStatus("COMPLETED");
        session2.setDiamondStolen(false);
        session2.setStartedAt(LocalDateTime.of(2026, 1, 2, 11, 0));
        session2.setEndedAt(LocalDateTime.of(2026, 1, 2, 11, 7));
        session2.setFinalScore(2500);

        GameSession session3 = new GameSession();
        session3.setUser(user);
        session3.setStatus("RUNNING");
        session3.setDiamondStolen(false);
        session3.setStartedAt(LocalDateTime.of(2026, 1, 3, 9, 0));
        session3.setEndedAt(null);
        session3.setFinalScore(null);

        when(gameSessionRepository.findByUserId(7L)).thenReturn(List.of(session1, session2, session3));

        ProfileStatsResponse stats = profileService.getStatsForUser(7L);

        assertEquals(3, stats.getGamesPlayed());
        assertEquals(1, stats.getGamesWon());
        assertEquals("00:04:00", stats.getBestTime());
        assertEquals(18000, stats.getBestScore());
    }
}
