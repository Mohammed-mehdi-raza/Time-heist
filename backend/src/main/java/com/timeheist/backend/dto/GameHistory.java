package com.timeheist.backend.dto;

import java.security.Timestamp;
import java.time.LocalDateTime;

import com.timeheist.backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class GameHistory {

	private long sessionid;
	private long userid;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private int score;
}
