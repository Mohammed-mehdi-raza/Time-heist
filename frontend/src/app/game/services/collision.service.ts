import { Injectable } from '@angular/core';
import { GameMap } from '../models/map.model';
import { Position } from '../models/position.model';
import { GameService } from './game.service';
import { TrapService } from './trap.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CollisionService {
  constructor(private readonly gameService: GameService, private readonly trapService: TrapService) {}

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
      const state = this.gameService.currentState;
      if (state) {
        this.gameService.updateState({ eventMessage: 'Ouch!' });
      }
      return true;
    }

    return gameMap.tiles[position.y][position.x] === 'wall';
  }

  checkInteractions(position: Position): void {
    const state = this.gameService.currentState;

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

    const currentTile = state.map.tiles[position.y][position.x];

    if (currentTile === 'trap') {
      this.handleTrap();
    }
  }

  private handleTrap(): void {
    const state = this.gameService.currentState;

    if (!state) {
      return;
    }

    const updatedHealth = state.player.health - 1;

    if (updatedHealth <= 0) {
      this.gameService.loseGame('You were caught by a trap');
      return;
    }

    this.gameService.updateState({
      player: {
        ...state.player,
        health: updatedHealth
      },
      eventMessage: 'You stepped on a trap'
    });
  }
}