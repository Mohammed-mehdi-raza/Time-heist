package com.timeheist.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.timeheist.backend.entity.PlayerProfile;
import com.timeheist.backend.exception.ResourceNotFoundException;
import com.timeheist.backend.repository.ProfileRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepo profileRepo;

    public PlayerProfile createPlayer(PlayerProfile player) {
        try {
            return profileRepo.save(player);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create player", e);
        }
    }

    public PlayerProfile updatePlayer(PlayerProfile player) {
        Long playerId = player.getId();

        if (!profileRepo.existsById(playerId)) {
            throw new ResourceNotFoundException(
                    "Player with ID " + playerId + " does not exist."
            );
        }

        try {
            return profileRepo.save(player);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to update player with ID " + playerId, e
            );
        }
    
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
    
}
