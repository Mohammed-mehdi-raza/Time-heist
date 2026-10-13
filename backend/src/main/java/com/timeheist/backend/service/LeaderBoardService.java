package com.timeheist.backend.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import com.timeheist.backend.dto.LeaderBoardDTO;
import com.timeheist.backend.entity.GameSession;
import com.timeheist.backend.entity.User;
import com.timeheist.backend.exception.ResourceNotFoundException;
import com.timeheist.backend.repository.GameSessionRepository;
import com.timeheist.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class LeaderBoardService {
	
	@Autowired
    private GameSessionRepository gameSessionRepository;
	
	@Autowired
    private UserRepository userRepository;
	
	@Autowired
	private LeaderBoardRedisService leaderBoardRedisService;
	
//	@Transactional
//	public List<LeaderBoardDTO> getUsersTop10Score(Long userId) {
//		List<GameSession> list = gameSessionRepository.findTop10ByUserIdAndFinalScoreIsNotNullOrderByFinalScoreDesc(userId);
//		User user = userRepository.findById(userId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "User with ID " + userId + " does not exist."
//                        )
//                );
//		
//		List<LeaderBoardDTO> res = new ArrayList<LeaderBoardDTO>();
//		for(GameSession gs:list) {
//			LeaderBoardDTO dto = new LeaderBoardDTO();
//			dto.setUsername(user.getUsername());
//			dto.setScore(gs.getFinalScore());
//			res.add(dto);
//		}
//		return res;
//	}
	
	@Transactional
	public List<LeaderBoardDTO> getUsersTop10Score(Long userId) {

	    User user = userRepository.findById(userId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "User with ID " + userId +
	                            " does not exist."
	                    )
	            );

	    List<GameSession> sessions = gameSessionRepository
	            .findTop10ByUserIdAndFinalScoreIsNotNullOrderByFinalScoreDesc(userId);
	    List<LeaderBoardDTO> res = new ArrayList<>();

	    for (GameSession session : sessions) {

	        LeaderBoardDTO dto = new LeaderBoardDTO();

	        dto.setUsername(user.getUsername());
	        dto.setScore(session.getFinalScore());

	        res.add(dto);
	    }

	    return res;
	}
	
//	@Transactional
//	public List<LeaderBoardDTO> getGlobalTop10Score(){
//		List<GameSession> list = gameSessionRepository.findTop10ByFinalScoreIsNotNullOrderByFinalScoreDesc();
//		List<LeaderBoardDTO> res = new ArrayList<LeaderBoardDTO>();
//		for(GameSession gs:list) {
//			LeaderBoardDTO dto = new LeaderBoardDTO();
//			dto.setUsername(gs.getUser().getUsername());
//			Duration duration = Duration.between(gs.getStartedAt(), gs.getEndedAt());
//			long totalSeconds = duration.getSeconds();
//			long minutes = totalSeconds/60;
//			long seconds = totalSeconds % 60;
//			dto.setTime(String.format("%02d:%02d", minutes,seconds));
//			dto.setScore(gs.getFinalScore());
//			res.add(dto);
//		}
//		return res;
//	}
	
	@Transactional
	public List<LeaderBoardDTO> getGlobalTop10Score() {

	    Set<ZSetOperations.TypedTuple<Object>> redisData =
	    		leaderBoardRedisService.getGlobalTop10();
	    List<LeaderBoardDTO> res = new ArrayList<>();
	    for (ZSetOperations.TypedTuple<Object> entry : redisData) {
	        Long userId = Long.valueOf(entry.getValue().toString());
	        Integer score = entry.getScore().intValue();
	        User user = userRepository.getById(userId);
	        LeaderBoardDTO dto = new LeaderBoardDTO();
	        dto.setUsername(user.getUsername());
	        dto.setScore(score);
	        res.add(dto);
	    }

	    return res;
	}
	
//	@Transactional
//	public List<LeaderBoardDTO> get24hTop10Score(){
//		LocalDateTime last24Hours = LocalDateTime.now().minusHours(24);
//		List<GameSession> list = gameSessionRepository.findTop10ByFinalScoreIsNotNullAndEndedAtAfterOrderByFinalScoreDesc(last24Hours);
//		List<LeaderBoardDTO> res = new ArrayList<LeaderBoardDTO>();
//		for(GameSession gs:list) {
//			LeaderBoardDTO dto = new LeaderBoardDTO();
//			dto.setUsername(gs.getUser().getUsername());
//			dto.setScore(gs.getFinalScore());
//			res.add(dto);
//		}
//		return res;
//	}
	
	@Transactional
	public List<LeaderBoardDTO> get24hTop10Score() {

	    Set<Object> gameIds =
	            leaderBoardRedisService.get24HourGameIds();

	    List<GameSession> sessions = new ArrayList<>();

	    for (Object gameId : gameIds) {

	        Long sessionId =
	                Long.valueOf(gameId.toString());

	        GameSession session =
	                gameSessionRepository.findById(sessionId)
	                        .orElse(null);

	        if (session != null
	                && session.getFinalScore() != null) {

	            sessions.add(session);
	        }
	    }

	    sessions.sort(
	            Comparator.comparing(
	                    GameSession::getFinalScore
	            ).reversed()
	    );

	    List<LeaderBoardDTO> res = new ArrayList<>();

	    for (GameSession gs :
	            sessions.stream().limit(10).toList()) {

	        LeaderBoardDTO dto =
	                new LeaderBoardDTO();

	        dto.setUsername(
	                gs.getUser().getUsername()
	        );

	        dto.setScore(
	                gs.getFinalScore()
	        );

	        res.add(dto);
	    }

	    return res;
	}
}
