import { Injectable } from '@angular/core';

export interface GuardPosition {
  x: number;
  y: number;
}

export interface PatrolPoint {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  moveTowards(
    current: GuardPosition,
    target: PatrolPoint,
    speed: number
  ): GuardPosition {

    const dx = target.x - current.x;
    const dy = target.y - current.y;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );

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

}