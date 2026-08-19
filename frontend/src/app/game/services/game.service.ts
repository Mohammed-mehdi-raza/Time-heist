import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { GameMap } from '../models/map.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly initialTime = 0;

  private readonly gameStateSubject =
    new BehaviorSubject<GameState | null>(null);

  readonly gameState$ = this.gameStateSubject.asObservable();

  // Track active timeouts so we can cancel them on reset
  private winTimeoutId?: ReturnType<typeof setTimeout>;
  private deathTimeoutId?: ReturnType<typeof setTimeout>;

  /**
   * Resets the game state back to default (null) and cancels active timers.
   * Call this when navigating back to the main menu.
   */
  resetGame(): void {
    this.clearPendingTimeouts();
    this.gameStateSubject.next(null);
  }

  startGame(gameMap: GameMap): void {
    // Clear any lingering timers from previous runs
    this.clearPendingTimeouts();

    const state: GameState = {
      status: 'running',
      map: gameMap,
      player: {
        id: 'player-1',
        position: { ...gameMap.playerStart },
        direction: 'down',
        speed: 1,
        health: 3,
        hasDiamond: false
      },
      guards: (gameMap.guards ?? []).map((guard) => ({
        id: guard.id,
        position: { ...guard.start },
        patrolPoints: [...guard.path],
        currentPatrolIndex: 0,
        visionRange: guard.visionRange ?? 2.5,
        isAlerted: false
      })),
      remainingTime: this.initialTime,
      score: 0,
      objective: 'Find the diamond and escape',
      eventMessage: 'Mission started'
    };

    this.gameStateSubject.next(state);
  }

  get currentState(): GameState | null {
    return this.gameStateSubject.value;
  }

  updateState(partialState: Partial<GameState>): void {
    const currentState = this.currentState;

    if (!currentState) {
      return;
    }

    this.gameStateSubject.next({
      ...currentState,
      ...partialState
    });
  }

  collectDiamond(): void {
    const currentState = this.currentState;

    if (!currentState || currentState.player.hasDiamond) {
      return;
    }

    this.updateState({
      player: {
        ...currentState.player,
        hasDiamond: true
      },
      objective: 'Reach the exit',
      eventMessage: 'Diamond collected'
    });
  }

  tryEscape(): void {
    const currentState = this.currentState;

    if (!currentState || currentState.status !== 'running') {
      return;
    }

    if (!currentState.player.hasDiamond) {
      this.updateState({ eventMessage: 'Collect the diamond first' });
      return;
    }

    this.updateState({
      status: 'winning',
      eventMessage: 'Escaping...'
    });

    // Save timer reference
    this.winTimeoutId = setTimeout(() => {
      if (this.currentState?.status === 'winning') {
        this.updateState({
          status: 'won',
          score: currentState.score + currentState.remainingTime * 10,
          eventMessage: 'You escaped successfully'
        });
      }
    }, 3600);
  }

  loseGame(message: string): void {
    const currentState = this.currentState;

    if (!currentState || currentState.status !== 'running') {
      return;
    }

    this.updateState({
      status: 'dying',
      eventMessage: message
    });

    // Save timer reference
    this.deathTimeoutId = setTimeout(() => {
      if (this.currentState?.status === 'dying') {
        this.updateState({
          status: 'lost',
          eventMessage: message
        });
      }
    }, 3000);
  }

  pauseGame(): void {
    if (this.currentState?.status === 'running') {
      this.updateState({ status: 'paused' });
    }
  }

  resumeGame(): void {
    if (this.currentState?.status === 'paused') {
      this.updateState({ status: 'running' });
    }
  }

  /**
   * Helper method to prevent dangling timers
   */
  private clearPendingTimeouts(): void {
    if (this.winTimeoutId) {
      clearTimeout(this.winTimeoutId);
      this.winTimeoutId = undefined;
    }
    if (this.deathTimeoutId) {
      clearTimeout(this.deathTimeoutId);
      this.deathTimeoutId = undefined;
    }
  }
}