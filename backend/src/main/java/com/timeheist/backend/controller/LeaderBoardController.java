package com.timeheist.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timeheist.backend.dto.ApiResponse;
import com.timeheist.backend.dto.LeaderBoardDTO;
import com.timeheist.backend.service.LeaderBoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leaderBoard")
@RequiredArgsConstructor
public class LeaderBoardController {
	
	@Autowired
	private LeaderBoardService leaderBoardService;
	
	@GetMapping("/userstopscores/{userId}")
    public ResponseEntity<ApiResponse<List<LeaderBoardDTO>>> getUsersTop10score(@PathVariable Long userId) {
        List<LeaderBoardDTO> list = leaderBoardService.getUsersTop10Score(userId);
		
        return ResponseEntity.ok(ApiResponse.<List<LeaderBoardDTO>>builder()
                .success(true)
                .message("Users top 10 scores fetched succesfully")
                .data(list)
                .build());
    }
	
	@GetMapping("/globaltopscores")
    public ResponseEntity<ApiResponse<List<LeaderBoardDTO>>> getGlobalTop10Scores() {
        List<LeaderBoardDTO> list = leaderBoardService.getGlobalTop10Score();
		
        return ResponseEntity.ok(ApiResponse.<List<LeaderBoardDTO>>builder()
                .success(true)
                .message("Global top 10 scores fetched succesfully")
                .data(list)
                .build());
    }
	
	@GetMapping("/lastdaytopscores")
    public ResponseEntity<ApiResponse<List<LeaderBoardDTO>>> getLast24hTop10Score() {
        List<LeaderBoardDTO> list = leaderBoardService.get24hTop10Score();
		
        return ResponseEntity.ok(ApiResponse.<List<LeaderBoardDTO>>builder()
                .success(true)
                .message("Global top 10 scores fetched succesfully")
                .data(list)
                .build());
    }
}
