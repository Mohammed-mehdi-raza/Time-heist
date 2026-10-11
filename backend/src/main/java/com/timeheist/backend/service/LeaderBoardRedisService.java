package com.timeheist.backend.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

@Service
public class LeaderBoardRedisService {
	private static final String GLOBAL_LEADERBOARD =
            "leaderboard:global";
	
	private static final String LEADERBOARD_24H_TIME =
	        "leaderboard:24h:time";

	private static final String LEADERBOARD_24H_SCORE =
	        "leaderboard:24h:score";

	@Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void LeaderboardRedisService(
            RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    
    private String getUserLeaderboardKey(Long userId) {
        return "leaderboard:user:" + userId;
    }

    public void addOrUpdateGlobalScore(Long userId, int score) {

        ZSetOperations<String, Object> zSet =
                redisTemplate.opsForZSet();

        Double existingScore =
                zSet.score(GLOBAL_LEADERBOARD, userId.toString());

        if (existingScore == null || score > existingScore) {
            zSet.add(
                GLOBAL_LEADERBOARD,
                userId.toString(),
                score
            );
        }
    }
    
    public Set<ZSetOperations.TypedTuple<Object>> getGlobalTop10() {

        return redisTemplate
                .opsForZSet()
                .reverseRangeWithScores(
                        GLOBAL_LEADERBOARD,
                        0,
                        9
                );
    }
    
    public void add24HourScore(
            Long gameSessionId,
            Integer score,
            LocalDateTime endedAt) {

        long timestamp = endedAt
                .atZone(ZoneId.systemDefault())
                .toEpochSecond();

        redisTemplate.opsForZSet().add(
                LEADERBOARD_24H_TIME,
                gameSessionId.toString(),
                timestamp
        );

        redisTemplate.opsForZSet().add(
                LEADERBOARD_24H_SCORE,
                gameSessionId.toString(),
                score
        );
    }
    
    public Set<Object> get24HourGameIds() {

        long now = Instant.now().getEpochSecond();

        long last24Hours = now - (24 * 60 * 60);

        return redisTemplate.opsForZSet()
                .rangeByScore(
                        LEADERBOARD_24H_TIME,
                        last24Hours,
                        now
                );
    }
    
    public void addUserScore(
            Long userId,
            Long gameSessionId,
            Integer score) {

        String key = getUserLeaderboardKey(userId);

        redisTemplate.opsForZSet().add(
                key,
                gameSessionId.toString(),
                score
        );
    }
    
    public Set<ZSetOperations.TypedTuple<Object>> getUserTop10(
            Long userId) {

        String key = getUserLeaderboardKey(userId);

        return redisTemplate.opsForZSet()
                .reverseRangeWithScores(
                        key,
                        0,
                        9
                );
    }
}