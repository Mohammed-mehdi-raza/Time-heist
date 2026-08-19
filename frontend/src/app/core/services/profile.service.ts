import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { PlayerProfile } from '../../shared/models/player-profile.model';

export interface ProfileStatsResponse {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: string;
  bestScore: number;
}

export interface UpdateProfileRequest {
  userId: number;
  username?: string;
  displayName: string;
  avatar: string;
  bio: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = `${environment.apiUrl}/profile`;

  constructor(private readonly http: HttpClient) {}

  getProfile(userId: number): Observable<ApiResponse<PlayerProfile>> {
    return this.http.get<ApiResponse<PlayerProfile>>(`${this.apiUrl}/user/${userId}`);
  }

  createProfileIfMissing(
    userId: number,
    displayName: string,
    avatar: string,
    bio: string = 'Silent, precise, and always one step ahead.'
  ): Observable<ApiResponse<PlayerProfile>> {
    return this.http.post<ApiResponse<PlayerProfile>>(`${this.apiUrl}/create`, {
      userId,
      displayName,
      avatar,
      bio
    });
  }

  updateProfile(request: UpdateProfileRequest): Observable<ApiResponse<PlayerProfile>> {
    return this.http.put<ApiResponse<PlayerProfile>>(`${this.apiUrl}/update`, request);
  }

  getProfileStats(userId: number): Observable<ApiResponse<ProfileStatsResponse>> {
    return this.http.get<ApiResponse<ProfileStatsResponse>>(`${this.apiUrl}/stats/${userId}`);
  }
}
