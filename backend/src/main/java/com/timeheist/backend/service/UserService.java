package com.timeheist.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.timeheist.backend.dto.UserDto;
import com.timeheist.backend.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	public UserDto getUserDetailsByName(String username) {
		//fetch userDetails by username from database
        return userRepository.findByUsername(username)
                .map(user -> new UserDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail()
                ))
                .orElse(null);  
	}
}
