package com.timeheist.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.timeheist.backend.entity.PlayerProfile;

@Repository
public interface ProfileRepo extends JpaRepository<PlayerProfile, Long> {
    
}
