package com.timeheist.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.timeheist.backend.dto.ApiResponse;
import com.timeheist.backend.dto.GameHistory;

import com.timeheist.backend.service.GameHistoryService;

@RestController
@RequestMapping("/api/gameHistory")
public class GameHistoryController {
	
	@Autowired
	private GameHistoryService gameHistoryService;

	@GetMapping("/user/{userid}")
	public ResponseEntity<ApiResponse<List<GameHistory>>> getGameHistory(@PathVariable Long userid) {
		 ApiResponse<List<GameHistory>> response = ApiResponse.<List<GameHistory>>builder()
	                .success(false)
	                .message("user game history fetched succesfully")
	                .data(gameHistoryService.getAllGameHistory(userid))
	                .build();
		 return ResponseEntity.ok(response);
	}

}
