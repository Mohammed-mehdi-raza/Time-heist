package com.timeheist.backend.service;

import java.time.Duration;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timeheist.backend.dto.ProfileStatsResponse;
import com.timeheist.backend.entity.GameSession;
import com.timeheist.backend.entity.PlayerProfile;
import com.timeheist.backend.entity.User;
import com.timeheist.backend.exception.ResourceNotFoundException;
import com.timeheist.backend.repository.GameSessionRepository;
import com.timeheist.backend.repository.ProfileRepo;
import com.timeheist.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepo profileRepo;
    private final GameSessionRepository gameSessionRepository;
    private final UserRepository userRepository;

    @Transactional
    public PlayerProfile createPlayerForUser(Long userId, String displayName, String avatar) {
        return createPlayerForUser(userId, displayName, avatar, null);
    }

    @Transactional
    public PlayerProfile createPlayerForUser(Long userId, String displayName, String avatar, String bio) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User with ID " + userId + " does not exist."
                ));

        return profileRepo.findByUserId(userId)
                .orElseGet(() -> {
                    PlayerProfile profile = new PlayerProfile();
                    profile.setUser(user);
                    profile.setDisplayName(
                            displayName != null && !displayName.isBlank()
                                    ? displayName
                                    : user.getUsername()
                    );
                    profile.setAvatar(
                            avatar != null && !avatar.isBlank()
                                    ? avatar
                                    : "/assets/Newchar/Front - Walking/Front - Walking_000.png"
                    );
                    profile.setBio(bio != null ? bio : "Silent, precise, and always one step ahead.");
                    return profileRepo.save(profile);
                });
    }

    @Transactional(readOnly = true)
    public PlayerProfile getProfileForUser(Long userId) {
        return profileRepo.findByUserId(userId)
                .orElseGet(() -> createPlayerForUser(userId, null, null));
    }

    @Transactional
    public PlayerProfile updatePlayerForUser(Long userId, String username, String displayName, String avatar, String bio) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User with ID " + userId + " does not exist."
                ));

        PlayerProfile profile = profileRepo.findByUserId(userId)
                .orElseGet(() -> createPlayerForUser(userId, displayName, avatar, bio));

        if (username != null && !username.isBlank()) {
            String trimmedUsername = username.trim();
            if (!trimmedUsername.equals(user.getUsername())) {
                if (userRepository.existsByUsername(trimmedUsername)) {
                    throw new IllegalArgumentException("Username already exists");
                }
                user.setUsername(trimmedUsername);
                userRepository.save(user);
            }
        }

        if (displayName != null && !displayName.isBlank()) {
            profile.setDisplayName(displayName.trim());
        }

        if (avatar != null && !avatar.isBlank()) {
            profile.setAvatar(avatar);
        }

        if (bio != null) {
            profile.setBio(bio);
        }

        return profileRepo.save(profile);
    }

    public PlayerProfile createPlayer(PlayerProfile player) {
        if (player == null || player.getUser().getId() == null) {
            throw new IllegalArgumentException("Player profile requires a valid user.");
        }

        return createPlayerForUser(
                player.getUser().getId(),
                player.getDisplayName(),
                player.getAvatar()
        );
    }

    public PlayerProfile updatePlayer(PlayerProfile player) {
        if (player == null || player.getId() == null) {
            throw new IllegalArgumentException("Player profile ID is required for update.");
        }

        PlayerProfile existing = profileRepo.findById(player.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Player with ID " + player.getId() + " does not exist."
                ));

        if (player.getDisplayName() != null) {
            existing.setDisplayName(player.getDisplayName());
        }

        if (player.getAvatar() != null) {
            existing.setAvatar(player.getAvatar());
        }

        return profileRepo.save(existing);
    }

    @Transactional(readOnly = true)
    public ProfileStatsResponse getStatsForUser(Long userId) {
        List<GameSession> sessions = gameSessionRepository.findByUserId(userId);

        int gamesPlayed = sessions.size();
        int gamesWon = (int) sessions.stream()
                .filter(session -> session.getFinalScore()!=null)
                .count();

        String bestTime = sessions.stream()
                .filter(session -> session.getEndedAt() != null && session.getStartedAt() != null)
                .map(session -> Duration.between(session.getStartedAt(), session.getEndedAt()).getSeconds())
                .filter(seconds -> seconds > 0)
                .min(Long::compareTo)
                .map(this::formatDuration)
                .orElse("00:00:00");

        int bestScore = sessions.stream()
                .map(GameSession::getFinalScore)
                .filter(score -> score != null)
                .max(Comparator.naturalOrder())
                .orElse(0);

        return new ProfileStatsResponse(gamesPlayed, gamesWon, bestTime, bestScore);
    }

    public void deletePlayer(Long playerId) {
        if (!profileRepo.existsById(playerId)) {
            throw new ResourceNotFoundException(
                    "Player with ID " + playerId + " does not exist."
            );
        }

        try {
            profileRepo.deleteById(playerId);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to delete player with ID " + playerId, e
            );
        }
    }

    private String formatDuration(Long totalSeconds) {
        long seconds = totalSeconds;
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        long remainingSeconds = seconds % 60;
        return String.format("%02d:%02d:%02d", hours, minutes, remainingSeconds);
    }
}
