import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeaderBoardDTO } from '../models/leaderboard.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  
  // Update this base URL to match your backend environment configuration if needed
  private readonly baseUrl = 'http://localhost:8080/api/leaderBoard';

  constructor(private http: HttpClient) {}

  /**
   * Fetches a specific user's top 10 scores
   * @param userId The ID of the user
   */
  getUsersTop10Scores(userId: number): Observable<LeaderBoardDTO[]> {
    return this.http.get<ApiResponse<LeaderBoardDTO[]>>(`${this.baseUrl}/userstopscores/${userId}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Fetches the global top 10 scores
   */
  getGlobalTop10Scores(): Observable<LeaderBoardDTO[]> {
    return this.http.get<ApiResponse<LeaderBoardDTO[]>>(`${this.baseUrl}/globaltopscores`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Fetches the top 10 scores from the last 24 hours
   */
  getLast24hTop10Scores(): Observable<LeaderBoardDTO[]> {
    return this.http.get<ApiResponse<LeaderBoardDTO[]>>(`${this.baseUrl}/lastdaytopscores`).pipe(
      map(response => response.data)
    );
  }
}