import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest
} from '../models/auth.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl +'/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, request)
      .pipe(
        map(response => response.data),
        tap(response => {
          localStorage.setItem('access_token', response.token);
        })
      );
  }

  register(request: RegisterRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrl}/register`,
      request
    ).pipe(
      map(() => void 0)
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}