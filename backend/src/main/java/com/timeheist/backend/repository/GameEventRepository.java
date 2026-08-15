package com.timeheist.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timeheist.backend.entity.GameEvent;

@Repository
public interface GameEventRepository extends JpaRepository<GameEvent, Long> {
    
    List<GameEvent> findByGameSessionId(Long gameSessionId);
    
    List<GameEvent> findByGameSessionIdOrderByEventTimeAsc(Long gameSessionId);
    
    List<GameEvent> findByGameSessionIdAndEventType(Long gameSessionId, String eventType);
}
