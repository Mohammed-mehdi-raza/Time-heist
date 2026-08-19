package com.timeheist.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileStatsResponse {

    private int gamesPlayed;
    private int gamesWon;
    private String bestTime;
    private int bestScore;
}
