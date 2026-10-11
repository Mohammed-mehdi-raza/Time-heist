package com.timeheist.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timeheist.backend.entity.GameSession;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    
    List<GameSession> findByUserId(Long userId);
    
    Optional<GameSession> findByIdAndUserId(Long id, Long userId);
    
    List<GameSession> findByUserIdOrderByStartedAtDesc(Long userId);
    
    List<GameSession> findTop10ByUserIdAndFinalScoreIsNotNullOrderByFinalScoreDesc(Long userId);
    
    List<GameSession> findTop10ByFinalScoreIsNotNullOrderByFinalScoreDesc();
    
    List<GameSession> findTop10ByFinalScoreIsNotNullAndEndedAtAfterOrderByFinalScoreDesc(LocalDateTime time);
}
