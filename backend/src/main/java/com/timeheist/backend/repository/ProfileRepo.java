package com.timeheist.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timeheist.backend.entity.PlayerProfile;


public interface ProfileRepo extends JpaRepository<PlayerProfile, Long> {
    
}
