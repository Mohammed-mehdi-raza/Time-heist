import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  private deathTimers: any[] = [];

  // Win Animation State
  winPhase: 1 | 2 | 3 = 1;
  private winInterval: any;
  private winTimeout: any;

  private stateSub?: Subscription;
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
    private readonly cdr: ChangeDetectorRef,
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

  get isWinning(): boolean {
    return this.gameService.currentState?.status === 'winning';
  }

  get currentHealth(): number {
    return this.gameService.currentState?.player.health ?? 0; 
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
  // testWin(): void {
  //   const state = this.gameService.currentState;
  //   if (state && state.status === 'running') {
  //     // 1. Force diamond collection so tryEscape() doesn't block it
  //     this.gameService.updateState({
  //       player: { ...state.player, hasDiamond: true }
  //     });
      
  //     // 2. Trigger the actual win sequence
  //     this.gameService.tryEscape();
  //   }
  // }

  formatTime(totalSeconds: number): string {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  restartGame(): void {
    this.resetDeathAnimation();
    this.resetWinAnimation();
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

    // Listen to game state changes
    this.gameService.gameState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        if (state?.status === 'winning') {
          this.audioService.stopMusic();
          this.audioService.playWin();
          this.finishSession('won');
          
          // FORCE UI UPDATE
          this.startWinAnimation();
          this.cdr.detectChanges(); 
        } else if (state?.status === 'won') {
          if (!this.sessionFinished) {
             this.audioService.stopMusic();
             this.audioService.playWin();
             this.finishSession('won');
          }
        } else if (state?.status === 'dying') {
          this.audioService.stopMusic();
          this.audioService.playGameOver();
          this.finishSession('lost');
          this.startDeathAnimation();
          this.cdr.detectChanges();
        } else if (state?.status === 'lost') {
          if (!this.sessionFinished) {
             this.audioService.stopMusic();
             this.audioService.playGameOver();
             this.finishSession('lost');
          }
        }
      });

    // Clean up old stateSub logic, we handle it in the main subscription above now
    this.stateSub = this.gameService.gameState$.subscribe(state => {
       if (state?.status === 'running') {
         if (this.winInterval) this.resetWinAnimation();
         if (this.deathPhase !== 0) this.resetDeathAnimation();
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

  startWinAnimation(): void {
    this.winPhase = 1;
    let currentFrame = 1;
    
    // Cycle through 1, 2, 3 every 400ms
    this.winInterval = setInterval(() => {
      currentFrame = currentFrame >= 3 ? 1 : currentFrame + 1;
      this.winPhase = currentFrame as 1 | 2 | 3;
    }, 400); 

    // Clear interval after 3.6 seconds (exactly 3 loops)
    this.winTimeout = setTimeout(() => {
      if (this.winInterval) clearInterval(this.winInterval);
    }, 3600);
  }

  resetWinAnimation(): void {
    if (this.winInterval) clearInterval(this.winInterval);
    if (this.winTimeout) clearTimeout(this.winTimeout);
    this.winInterval = null;
    this.winTimeout = null;
    this.winPhase = 1;
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

    this.gameSessionApiService.finishGame(this.activeSessionId, result).subscribe({
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
    this.resetWinAnimation();
    this.playerService.stopListening();
    this.audioService.stopMusic();
    this.activeSessionId = null;
    this.destroy$.next();
    this.destroy$.complete();
  }
}