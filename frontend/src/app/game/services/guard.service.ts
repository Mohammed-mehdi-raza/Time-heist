import { Injectable } from '@angular/core';
import { Position } from '../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  moveTowards(
    current: Position,
    target: Position,
    speed: number
  ): Position {

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