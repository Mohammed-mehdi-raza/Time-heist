import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MapComponent } from '../map/map.component';
import { GameMap } from '../../models/map.model';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { HeistModalComponent, HeistStats } from '../heist-modal/heist-modal.component';
import { GameTimerService } from '../../services/game-timer.service';
import { GameOverModalComponent } from '../game-over-modal/game-over-modal.component';
import { AudioService } from '../../services/audio.service';
import { GameSessionApiService } from '../../services/game-session-api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-game-screen',
  standalone: true,
  imports: [MapComponent, HeistModalComponent, GameOverModalComponent],
  templateUrl: './game-screen.component.html',
  styleUrl: './game-screen.component.scss'
})
export class GameScreenComponent implements OnInit, OnDestroy {

  gameMap?: GameMap;
  private destroy$ = new Subject<void>();

  // Death Animation State
  deathPhase: 0 | 1 | 2 | 3 = 0;
  isFalling = false;
  private stateSub?: Subscription;
  private deathTimers: any[] = [];
  private activeSessionId: number | null = null;
  private sessionFinished = false;
  private pendingFinishResult: 'won' | 'lost' | null = null;
  private backendFinalScore: number | null = null;
  private isScoreLoading = false;

  constructor(
    private readonly http: HttpClient,
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly timerService: GameTimerService,
    private readonly router: Router,
    private readonly audioService: AudioService,
    private readonly authService: AuthService,
    private readonly gameSessionApiService: GameSessionApiService,
  ) {}

  // --- GETTERS ---

  get currentTime(): number {
    return this.gameService.currentState?.remainingTime ?? 0;
  }

  get gameMessage(): string {
    return this.gameService.currentState?.eventMessage ?? '';
  }

  get isGameWon(): boolean {
    return this.gameService.currentState?.status === 'won';
  }

  get isGameLost(): boolean {
    return this.gameService.currentState?.status === 'lost';
  }

  get isSoundMuted(): boolean {
    return this.audioService.isMuted();
  }
  get isDying(): boolean {
    return this.gameService.currentState?.status === 'dying';
  }

  get heistStats(): HeistStats {
    const state = this.gameService.currentState;
    const elapsedSeconds = state ? Math.max(0, state.remainingTime) : 0;
    let displayScore: number | string = 0;

    if (this.isGameWon) {
      if (this.isScoreLoading) {
        displayScore = 'Calculating score...';
      } else if (this.backendFinalScore !== null) {
        displayScore = this.backendFinalScore;
      }
    }

    return {
      timeTaken: this.formatTime(elapsedSeconds),
      cctvAlerts: 0,
      trapsHit: 0,
      scoreEarned: typeof displayScore === 'number' ? displayScore : 0,
      totalScore: displayScore
    };
  }

  // --- METHODS ---

  formatTime(totalSeconds: number): string {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

    get currentHealth(): number {
    return this.gameService.currentState?.player.health ?? 0; // NEW: reads current player health
  }

  restartGame(): void {
    this.resetDeathAnimation();
    this.backendFinalScore = null;
    this.isScoreLoading = false;
    this.sessionFinished = false;
    this.pendingFinishResult = null;

    if (!this.gameMap) {
      return;
    }

    const startLocalGame = () => {
      this.playerService.stopListening();
      this.gameService.startGame(this.gameMap!);
      this.timerService.start();
      this.playerService.startListening();
      this.audioService.startMusic();
    };

    const mapId = this.getMapId(this.gameMap);

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.gameSessionApiService.startGame(user.id, mapId).subscribe({
          next: (response) => {
            this.activeSessionId = response.data.id;

            if (this.pendingFinishResult) {
              this.finishSession(this.pendingFinishResult);
            }

            startLocalGame();
          },
          error: (error) => {
            console.error('Failed to start game session:', error);
            startLocalGame();
          }
        });
      },
      error: (error) => {
        console.error('Failed to load current user, falling back to local game:', error);
        startLocalGame();
      }
    });
  }

  goToMainMenu(): void {
    this.audioService.stopMusic();
    this.router.navigate(['']);
  }

  toggleSound(): void {
    this.audioService.toggleMute();
  }

  ngOnInit(): void {
    this.http
      .get<GameMap>('assets/maps/map1.json')
      .subscribe((gameMap) => {
        this.gameMap = gameMap;
        this.restartGame();
      });

    // Listen to game state changes to play appropriate sounds
    this.gameService.gameState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        if (state?.status === 'won') {
          this.audioService.stopMusic();
          this.audioService.playWin();
          this.finishSession('won');
        } else if (state?.status === 'dying') {
          this.audioService.stopMusic();
          this.audioService.playGameOver();
          this.finishSession('lost');
        } else if (state?.status === 'lost') {
          this.audioService.stopMusic();
          this.audioService.playGameOver();
          this.finishSession('lost');
        }
      });
    // Listen for the 'dying' state to start the animation
    this.stateSub = this.gameService.gameState$.subscribe(state => {
      if (state?.status === 'dying' && this.deathPhase === 0) {
        this.startDeathAnimation();
      }
    });
  }

  startDeathAnimation(): void {
    this.deathPhase = 1;
    this.isFalling = true;

    const t1 = setTimeout(() => {
      this.deathPhase = 2;
      this.isFalling = false;
    }, 1500);

    const t2 = setTimeout(() => {
      this.deathPhase = 3;
    }, 2200);
    
    this.deathTimers.push(t1, t2);
  }

  resetDeathAnimation(): void {
    this.deathTimers.forEach(t => clearTimeout(t));
    this.deathTimers = [];
    this.deathPhase = 0;
    this.isFalling = false;
  }

  private finishSession(result: 'won' | 'lost'): void {
    if (this.sessionFinished) {
      return;
    }

    if (this.activeSessionId === null) {
      this.pendingFinishResult = result;
      return;
    }

    this.sessionFinished = true;
    this.pendingFinishResult = null;

    this.gameSessionApiService.finishGame(this.activeSessionId).subscribe({
      next: () => {
        if (result === 'won') {
          this.isScoreLoading = true;
          this.gameSessionApiService.getGameScore(this.activeSessionId!).subscribe({
            next: (response) => {
              this.backendFinalScore = response.data.totalScore;
              this.isScoreLoading = false;
            },
            error: (error) => {
              console.error('Failed to load game score:', error);
              this.isScoreLoading = false;
            }
          });
        }
      },
      error: (error) => {
        console.error('Failed to finish game session:', error);
      }
    });
  }

  private getMapId(gameMap: GameMap): number {
    const mapId = Number(String(gameMap.id).match(/\d+/)?.[0] ?? '1');
    return Number.isFinite(mapId) ? mapId : 1;
  }

  ngOnDestroy(): void {
    this.stateSub?.unsubscribe();
    this.resetDeathAnimation();
    this.playerService.stopListening();
    this.audioService.stopMusic();
    this.destroy$.next();
    this.destroy$.complete();
  }
}