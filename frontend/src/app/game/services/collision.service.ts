import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { GameMap } from '../models/map.model';
import { Position } from '../models/position.model';
import { GameService } from './game.service';
import { TrapService } from './trap.service';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root',
})
export class CollisionService implements OnDestroy {
  private readonly hazardSubscription: Subscription;

  constructor(
    private readonly gameService: GameService,
    private readonly trapService: TrapService,
    private readonly audioService: AudioService,
  ) {
    this.hazardSubscription = interval(150).subscribe(() => this.checkCurrentPlayerHazard());
  }

  ngOnDestroy(): void {
    this.hazardSubscription.unsubscribe();
  }

  isWall(position: Position, gameMap: GameMap): boolean {
    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x >= gameMap.width ||
      position.y >= gameMap.height
    ) {
      return true;
    }
    // If a spike is currently up at this position, behave as opaque and show an "Ouch!" message
    if (this.trapService.isSpikeUp(position)) {
      this.gameService.loseGame('YOU WERE CAUGHT BY A TRAP');
      this.audioService.playTrap();
      return true;
    }

    return gameMap.tiles[position.y][position.x] === 'wall';
  }

  checkInteractions(position: Position): void {
    const state = this.gameService.currentState;
    if (!state || state.status !== 'running') {
      return;
    }

    if (!state || state.status !== 'running') {
      return;
    }

    const isSameTile = (a: Position, b: Position): boolean =>
      a.x === b.x && a.y === b.y;

    if (
      isSameTile(position, state.map.diamondPosition) &&
      !state.player.hasDiamond
    ) {
      this.gameService.collectDiamond();
    }

    if (isSameTile(position, state.map.exitPosition)) {
      this.gameService.tryEscape();
    }

    const currentTile = state.map.tiles[position.y]?.[position.x];

    if (currentTile === 'trap') {
      this.handleTrap();
      return;
    }

    const guardCollision = state.guards.some((guard) => {
      const guardTile = {
        x: Math.round(guard.position.x),
        y: Math.round(guard.position.y),
      };

      return guardTile.x === position.x && guardTile.y === position.y;
    });

    if (guardCollision) {
      this.gameService.loseGame('You were caught by a guard');
    }
  }

  private handleTrap(): void {
    this.gameService.loseGame('YOU WERE CAUGHT BY A TRAP');
  }

  private checkCurrentPlayerHazard(): void {
    const state = this.gameService.currentState;
    if (!state || state.status !== 'running') {
      return;
    }

    if (!state || state.status !== 'running') {
      return;
    }

    const playerPosition = state.player.position;

    if (this.trapService.isSpikeUp(playerPosition)) {
      this.gameService.loseGame('YOU WERE CAUGHT BY A TRAP');
    }
  }
}
