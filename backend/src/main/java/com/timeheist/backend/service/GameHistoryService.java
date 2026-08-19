package com.timeheist.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.timeheist.backend.dto.GameHistory;
import com.timeheist.backend.repository.GameSessionRepository;

@Service
public class GameHistoryService {
	
	@Autowired
	private GameSessionRepository gameSessionRepository;

    public List<GameHistory> getAllGameHistory(long userid){
        List<GameHistory> gameHistoryList = new ArrayList<GameHistory>();
        //fetch gamehistory from database based on userid
        gameHistoryList = gameSessionRepository.findByUserIdOrderByStartedAtDesc(userid)
                .stream()
                .map(gameSession -> new GameHistory(
                        gameSession.getId(),
                        gameSession.getUser().getId(),
                        gameSession.getStartedAt(),
                        gameSession.getEndedAt(),
                        gameSession.getFinalScore()
                ))
                .toList();
        return gameHistoryList;
    }
}
