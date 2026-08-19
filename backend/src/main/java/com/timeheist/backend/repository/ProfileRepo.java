package com.timeheist.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timeheist.backend.entity.PlayerProfile;

@Repository
public interface ProfileRepo extends JpaRepository<PlayerProfile, Long> {

    Optional<PlayerProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
