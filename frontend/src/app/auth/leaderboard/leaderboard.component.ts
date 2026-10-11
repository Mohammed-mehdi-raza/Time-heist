import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LeaderboardService } from '../../game/services/leaderboard.service';
import { LeaderBoardDTO } from '../../game/models/leaderboard.model';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  
  // Tabs: 'global' | 'last24h' | 'user'
  activeTab: 'global' | 'last24h' | 'user' = 'global';
  
  leaderboardData: LeaderBoardDTO[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  
  constructor(
    private authService: AuthService,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit(): void {
    this.loadGlobalScores();
  }

  switchTab(tab: 'global' | 'last24h' | 'user'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    
    if (tab === 'global') {
      this.loadGlobalScores();
    } else if (tab === 'last24h') {
      this.loadLast24hScores();
    } else if (tab === 'user') {
      this.loadUserScores();
    }
  }

  loadGlobalScores(): void {
    this.isLoading = true;
    this.leaderboardService.getGlobalTop10Scores().subscribe({
      next: (data: LeaderBoardDTO[]) => {
        this.leaderboardData = data || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching global scores', err);
        this.errorMessage = 'Failed to load global leaderboard scores.';
        this.isLoading = false;
      }
    });
  }

  loadLast24hScores(): void {
    this.isLoading = true;
    this.leaderboardService.getLast24hTop10Scores().subscribe({
      next: (data: LeaderBoardDTO[]) => {
        this.leaderboardData = data || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching 24h scores', err);
        this.errorMessage = 'Failed to load last 24 hours scores.';
        this.isLoading = false;
      }
    });
  }

  loadUserScores(): void {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: user => {
        this.leaderboardService.getUsersTop10Scores(user.id).subscribe({
          next: (data: LeaderBoardDTO[]) => {
            this.leaderboardData = data || [];
            this.isLoading = false;
          },
          error: (err: any) => {
            console.error('Error fetching user top scores', err);
            this.errorMessage = 'Failed to load your top scores.';
            this.isLoading = false;
            this.leaderboardData = [];
          }
        });
      },
      error: (err: any) => {
        console.error('Error fetching current user', err);
        this.errorMessage = 'Failed to load your top scores.';
        this.isLoading = false;
        this.leaderboardData = [];
      }
    });
  }
}