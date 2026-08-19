package com.timeheist.backend.dto;


import java.time.LocalDateTime;


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
