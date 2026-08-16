import { Injectable } from '@angular/core';
import { GameMap } from '../models/map.model';
import { Position } from '../models/position.model';
import { GameService } from './game.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CollisionService {
  constructor(private readonly gameService: GameService) {}

  isWall(position: Position, gameMap: GameMap): boolean {
    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x >= gameMap.width ||
      position.y >= gameMap.height
    ) {
      return true;
    }

    return gameMap.tiles[position.y][position.x] === 'wall';
  }

  checkInteractions(position: Position): void {
    const state = this.gameService.currentState;

    if (!state || state.status !== 'running') {
      return;
    }

    if (
      position.x === state.map.diamondPosition.x &&
      position.y === state.map.diamondPosition.y &&
      !state.player.hasDiamond
    ) {
      this.gameService.collectDiamond();
    }

    if (
      position.x === state.map.exitPosition.x &&
      position.y === state.map.exitPosition.y
    ) {
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