import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { GameService } from './game.service';

@Injectable({ providedIn: 'root' })
export class GameTimerService implements OnDestroy {
  private timerSubscription?: Subscription;

  constructor(private readonly gameService: GameService) {}

  start(): void {
    if (this.timerSubscription) {
      return;
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      const state = this.gameService.currentState;

      if (!state || state.status !== 'running') {
        this.stop();
        return;
      }

      this.gameService.updateState({
        remainingTime: state.remainingTime + 1
      });
    });
  }

  stop(): void {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = undefined;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}