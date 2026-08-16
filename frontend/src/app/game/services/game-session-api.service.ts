import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../shared/models/api-response.model';
import { GameSession } from '../models/game-session.model';
import { environment } from '../../../environment/evironment';
@Injectable({
  providedIn: 'root',
})
export class GameSessionApiService {
  constructor() {}

  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + '/game/sessions';

  /**
   * Starts a new game session.
   *
   * POST /api/game/sessions?userId={userId}&mapId={mapId}
   */
  startGame(
    userId: number,
    mapId: number,
  ): Observable<ApiResponse<GameSession>> {
    const params = new HttpParams().set('userId', userId).set('mapId', mapId);

    return this.http.post<ApiResponse<GameSession>>(this.apiUrl, null, {
      params,
    });
  }

  /**
   * Fetches a game session.
   *
   * GET /api/game/sessions/{sessionId}
   */
  getGameSession(sessionId: number): Observable<ApiResponse<GameSession>> {
    return this.http.get<ApiResponse<GameSession>>(
      `${this.apiUrl}/${sessionId}`,
    );
  }

  /**
   * Finishes a game session.
   *
   * POST /api/game/sessions/{sessionId}/finish
   */
  finishGame(sessionId: number): Observable<ApiResponse<GameSession>> {
    return this.http.post<ApiResponse<GameSession>>(
      `${this.apiUrl}/${sessionId}/finish`,
      null,
    );
  }
}
