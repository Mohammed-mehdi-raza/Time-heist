package com.timeheist.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    private Long userId;
    private String username;
    private String displayName;
    private String avatar;
    private String bio;
}
