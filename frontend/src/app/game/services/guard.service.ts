import { Injectable } from '@angular/core';
import { Position } from '../models/position.model';
import { GameMap } from '../models/map.model';

export type GuardFacing = 'up' | 'right' | 'down' | 'left';

export interface GuardDetectionInput {
  guardPosition: Position;
  playerPosition: Position;
  facing: GuardFacing;
  visionRange: number;
  map: GameMap;
  fovDegrees?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  /**
   * If player is closer than this, guard catches player immediately,
   * even if guard is not directly facing player.
   */
  private readonly catchRadius = 0.55;

  moveTowards(
    current: Position,
    target: Position,
    speed: number
  ): Position {

    const dx = target.x - current.x;
    const dy = target.y - current.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= speed) {
      return {
        x: target.x,
        y: target.y
      };
    }

    return {
      x: current.x + (dx / distance) * speed,
      y: current.y + (dy / distance) * speed
    };
  }

  detectPlayer(input: GuardDetectionInput): boolean {

    const dx = input.playerPosition.x - input.guardPosition.x;
    const dy = input.playerPosition.y - input.guardPosition.y;

    const distance = Math.hypot(dx, dy);

    // Very close => caught immediately.
    if (distance <= this.catchRadius) {
      return true;
    }

    // Outside vision range.
    if (distance > input.visionRange) {
      return false;
    }

    const fovDegrees = input.fovDegrees ?? 60;

    // Check if player is inside vision cone.
    if (fovDegrees < 360) {
      const facingVector = this.getDirectionVector(input.facing);

      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;

      const dot =
        normalizedDx * facingVector.x +
        normalizedDy * facingVector.y;

      const halfFovRadians =
        (fovDegrees / 2) * (Math.PI / 180);

      const minDot = Math.cos(halfFovRadians);

      if (dot < minDot - 0.0001) {
        return false;
      }
    }

    // Check if walls block vision.
    return this.hasLineOfSight(
      input.guardPosition,
      input.playerPosition,
      input.map
    );
  }

  private getDirectionVector(facing: GuardFacing): Position {
    switch (facing) {
      case 'up':
        return { x: 0, y: -1 };

      case 'down':
        return { x: 0, y: 1 };

      case 'left':
        return { x: -1, y: 0 };

      case 'right':
      default:
        return { x: 1, y: 0 };
    }
  }

  private hasLineOfSight(
    from: Position,
    to: Position,
    map: GameMap
  ): boolean {

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    const distance = Math.hypot(dx, dy);

    if (distance < 0.001) {
      return true;
    }

    /**
     * Sample points between guard and player.
     * If any point is inside a wall tile, vision is blocked.
     */
    const steps = Math.max(1, Math.ceil(distance * 8));

    for (let i = 1; i < steps; i++) {
      const sampleX = from.x + (dx * i) / steps;
      const sampleY = from.y + (dy * i) / steps;

      if (this.isWallAt(sampleX, sampleY, map)) {
        return false;
      }
    }

    return true;
  }

  private isWallAt(
    x: number,
    y: number,
    map: GameMap
  ): boolean {

    /**
     * Guard position can be fractional because it moves smoothly.
     * Convert it to nearest tile index.
     */
    const tileX = Math.round(x);
    const tileY = Math.round(y);

    if (
      tileX < 0 ||
      tileY < 0 ||
      tileX >= map.width ||
      tileY >= map.height
    ) {
      return true;
    }

    return map.tiles?.[tileY]?.[tileX] === 'wall';
  }
}