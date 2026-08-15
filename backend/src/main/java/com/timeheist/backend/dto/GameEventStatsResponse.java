package com.timeheist.backend.dto;

import lombok.Data;

@Data
public class GameEventStatsResponse {

    private long cctvCaught;
    private long laserTriggered;
    private long holesTriggered;
    private long spikesHit;
    private long diamondStolen;
    private long guardCaught;
    private long escape;
}
