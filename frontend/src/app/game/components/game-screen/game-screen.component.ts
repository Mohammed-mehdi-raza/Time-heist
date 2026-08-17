import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { GameMap } from '../../models/map.model';
import { HttpClient } from '@angular/common/http';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { HeistModalComponent, HeistStats } from '../heist-modal/heist-modal.component';
import { GameTimerService } from '../../services/game-timer.service';
import { GameOverModalComponent } from '../game-over-modal/game-over-modal.component';
import { Router } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  constructor(
    private readonly http: HttpClient,
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly timerService: GameTimerService,
    private readonly router: Router,
    private readonly audioService: AudioService,
  ) {}

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

  get heistStats(): HeistStats {
    const state = this.gameService.currentState;
    const elapsedSeconds = state ? Math.max(0, state.remainingTime) : 0;

    return {
      timeTaken: this.formatTime(elapsedSeconds),
      cctvAlerts: 0,
      trapsHit: 0,
      scoreEarned: state?.score ?? 0,
      totalScore: state?.score ?? 0
    };
  }

  formatTime(totalSeconds: number): string {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  restartGame(): void {
    if (!this.gameMap) {
      return;
    }

    this.gameService.startGame(this.gameMap);
    this.timerService.start();
    this.playerService.startListening();
    this.audioService.startMusic();
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
        } else if (state?.status === 'lost') {
          this.audioService.stopMusic();
          this.audioService.playGameOver();
        }
      });
  }

  ngOnDestroy(): void {
    this.audioService.stopMusic();
    this.destroy$.next();
    this.destroy$.complete();
  }

}