package com.timeheist.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class GameScoreResponse {

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private long durationSeconds;

    private long cctvCaught;
    private long laserTriggered;
    private long holesTriggered;
    private long spikesHit;
    private long diamondStolen;

    private int totalScore;
}