import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapComponent } from '../map/map.component';
import { GameMap } from '../../models/map.model';
import { HttpClient } from '@angular/common/http';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { HeistModalComponent, HeistStats } from '../heist-modal/heist-modal.component';
import { GameTimerService } from '../../services/game-timer.service';
import { GameOverModalComponent } from '../game-over-modal/game-over-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-screen',
  standalone: true,
  imports: [MapComponent, HeistModalComponent, GameOverModalComponent],
  templateUrl: './game-screen.component.html',
  styleUrl: './game-screen.component.scss'
})
export class GameScreenComponent implements OnInit, OnDestroy {

  gameMap?: GameMap;
  
  // Death Animation State
  deathPhase: 0 | 1 | 2 | 3 = 0; 
  isFalling = false;
  private stateSub?: Subscription;
  private deathTimers: any[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly timerService: GameTimerService,
    private readonly router: Router,
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

  get isDying(): boolean {
    return this.gameService.currentState?.status === 'dying';
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
    // Reset death animation if restarting from a death state
    this.resetDeathAnimation(); 

    if (!this.gameMap) {
      return;
    }

    this.gameService.startGame(this.gameMap);
    this.timerService.start();
    this.playerService.startListening();
  }

  goToMainMenu(): void {
    this.router.navigate(['']);
  }

  // --- LIFECYCLE ---

  ngOnInit(): void {
    this.http
      .get<GameMap>('assets/maps/map1.json')
      .subscribe((gameMap) => {
        this.gameMap = gameMap;
        this.restartGame();
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

  ngOnDestroy(): void {
    this.stateSub?.unsubscribe();
    this.resetDeathAnimation();
    this.playerService.stopListening();
  }
}