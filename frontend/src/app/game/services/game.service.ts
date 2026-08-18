import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { GameMap } from '../models/map.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly initialTime = 120;

  private readonly gameStateSubject =
    new BehaviorSubject<GameState | null>(null);

  readonly gameState$ = this.gameStateSubject.asObservable();

  startGame(gameMap: GameMap): void {
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
      remainingTime: 0,
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

    if (!currentState) {
      return;
    }

    if (!currentState.player.hasDiamond) {
      this.updateState({
        eventMessage: 'Collect the diamond first'
      });
      return;
    }

    this.updateState({
      status: 'won',
      eventMessage: 'You escaped successfully'
    });
  }

  // loseGame(message: string): void {
  //   this.updateState({
  //     status: 'lost',
  //     eventMessage: message
  //   });
  // }
    loseGame(message: string): void {
      const currentState = this.currentState;
      // Prevent multiple deaths from triggering the animation repeatedly
      if (!currentState || currentState.status !== 'running') {
        return; 
      }

      // 1. Trigger the animation state
      this.updateState({
        status: 'dying',
        eventMessage: message
      });

      // 2. Wait 3 seconds for the animation to finish, then show the Game Over screen
      setTimeout(() => {
        if (this.currentState?.status === 'dying') {
          this.updateState({
            status: 'lost',
            eventMessage: message
          });
        }
      }, 3000); 
    }

  private calculateScore(
    durationSeconds: number,
    diamondStolen: boolean,
    cctvCaught: number,
    laserTriggered: number,
    holesTriggered: number,
    spikesHit: number,
  ): number {
    // Score is now calculated entirely on the backend.
    // This method is kept for backward compatibility but should not be used.
    return 0;
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
}