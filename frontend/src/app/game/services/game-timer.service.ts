import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { GameService } from './game.service';

@Injectable()
export class GameTimerService implements OnDestroy {
  private timerSubscription?: Subscription;

  constructor(private readonly gameService: GameService) {}

  start(): void {
    this.stop();

    this.timerSubscription = interval(1000).subscribe(() => {
      const state = this.gameService.currentState;

      if (!state || state.status !== 'running') {
        return;
      }

      const remainingTime = state.remainingTime - 1;

      if (remainingTime <= 0) {
        this.gameService.updateState({ remainingTime: 0 });
        this.gameService.loseGame('Time is over');
        this.stop();
        return;
      }

      this.gameService.updateState({ remainingTime });
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