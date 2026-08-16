// import { Injectable, NgZone } from '@angular/core';
// import { GameService } from './game.service';
// import { Direction } from '../models/player.model';
// import { Position } from '../models/position.model';
// import { CollisionService } from './collision.service';

// @Injectable(
//   {
//     providedIn: 'root'
//   }
// )
// export class PlayerService {
//   private pressedKeys = new Set<string>();
//   private animationFrameId?: number;

//   constructor(
//     private readonly gameService: GameService,
//     private readonly collisionService: CollisionService,
//     private readonly zone: NgZone
//   ) {}

//   startListening(): void {
//     window.addEventListener('keydown', this.onKeyDown);
//     window.addEventListener('keyup', this.onKeyUp);

//     this.zone.runOutsideAngular(() => {
//       this.runMovementLoop();
//     });
//   }

//   stopListening(): void {
//     window.removeEventListener('keydown', this.onKeyDown);
//     window.removeEventListener('keyup', this.onKeyUp);

//     if (this.animationFrameId) {
//       cancelAnimationFrame(this.animationFrameId);
//     }
//   }

//   private onKeyDown = (event: KeyboardEvent): void => {
//     const acceptedKeys = [
//       'ArrowUp',
//       'ArrowDown',
//       'ArrowLeft',
//       'ArrowRight',
//       'w',
//       'a',
//       's',
//       'd'
//     ];

//     if (acceptedKeys.includes(event.key)) {
//       event.preventDefault();
//       this.pressedKeys.add(event.key);
//     }
//   };

//   private onKeyUp = (event: KeyboardEvent): void => {
//     this.pressedKeys.delete(event.key);
//   };

//   private runMovementLoop = (): void => {
//     this.movePlayer();
//     this.animationFrameId = requestAnimationFrame(this.runMovementLoop);
//   };

//   private movePlayer(): void {
//     const state = this.gameService.currentState;

//     if (!state || state.status !== 'running') {
//       return;
//     }

//     let direction: Direction | null = null;

//     if (this.pressedKeys.has('ArrowUp') || this.pressedKeys.has('w')) {
//       direction = 'up';
//     } else if (
//       this.pressedKeys.has('ArrowDown') ||
//       this.pressedKeys.has('s')
//     ) {
//       direction = 'down';
//     } else if (
//       this.pressedKeys.has('ArrowLeft') ||
//       this.pressedKeys.has('a')
//     ) {
//       direction = 'left';
//     } else if (
//       this.pressedKeys.has('ArrowRight') ||
//       this.pressedKeys.has('d')
//     ) {
//       direction = 'right';
//     }

//     if (!direction) {
//       return;
//     }

//     const currentPosition = state.player.position;
//     const nextPosition = this.getNextPosition(currentPosition, direction);

//     if (this.collisionService.isWall(nextPosition, state.map)) {
//       return;
//     }

//     this.gameService.updateState({
//       player: {
//         ...state.player,
//         position: nextPosition,
//         direction
//       }
//     });

//     this.collisionService.checkInteractions(nextPosition);
//   }

//   private getNextPosition(
//     position: Position,
//     direction: Direction
//   ): Position {
//     const nextPosition = { ...position };

//     if (direction === 'up') {
//       nextPosition.y--;
//     }

//     if (direction === 'down') {
//       nextPosition.y++;
//     }

//     if (direction === 'left') {
//       nextPosition.x--;
//     }

//     if (direction === 'right') {
//       nextPosition.x++;
//     }

//     return nextPosition;
//   }
// }
import { Injectable, NgZone } from '@angular/core';
import { GameService } from './game.service';
import { Direction } from '../models/player.model';
import { Position } from '../models/position.model';
import { CollisionService } from './collision.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private pressedKeys = new Set<string>();
  private animationFrameId?: number;
  
  // Add a cooldown so the player moves 1 tile at a time, not 60
  private lastMoveTime = 0;
  private readonly moveDelay = 150; 

  constructor(
    private readonly gameService: GameService,
    private readonly collisionService: CollisionService,
    private readonly zone: NgZone
  ) {}

  startListening(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    this.zone.runOutsideAngular(() => {
      this.runMovementLoop();
    });
  }

  stopListening(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    // FIX: Force lowercase so Caps Lock doesn't break movement
    const key = event.key.toLowerCase(); 
    const acceptedKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'];

    if (acceptedKeys.includes(key)) {
      event.preventDefault();
      this.pressedKeys.add(key);
    }
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    this.pressedKeys.delete(event.key.toLowerCase());
  };

  private runMovementLoop = (): void => {
    this.movePlayer();
    this.animationFrameId = requestAnimationFrame(this.runMovementLoop);
  };

  get isMoving(): boolean {
    return this.pressedKeys.size > 0;
  }

  private movePlayer(): void {
    const state = this.gameService.currentState;
    if (!state || state.status !== 'running') return;

    const now = performance.now();
    if (now - this.lastMoveTime < this.moveDelay) return;

    let direction: Direction | null = null;

    if (this.pressedKeys.has('arrowup') || this.pressedKeys.has('w')) direction = 'up';
    else if (this.pressedKeys.has('arrowdown') || this.pressedKeys.has('s')) direction = 'down';
    else if (this.pressedKeys.has('arrowleft') || this.pressedKeys.has('a')) direction = 'left';
    else if (this.pressedKeys.has('arrowright') || this.pressedKeys.has('d')) direction = 'right';

    if (!direction) return;

    const moveDirection: Direction = direction; 

    const nextPosition = this.getNextPosition(state.player.position, moveDirection);

    if (this.collisionService.isWall(nextPosition, state.map)) {
      return;
    }

    this.zone.run(() => {
      this.gameService.updateState({
        player: {
          ...state.player,
          position: nextPosition,
          direction: moveDirection
        }
      });
    });

    this.collisionService.checkInteractions(nextPosition);
    this.lastMoveTime = now;
  }

  private getNextPosition(position: Position, direction: Direction): Position {
    const nextPosition = { ...position };
    if (direction === 'up') nextPosition.y--;
    if (direction === 'down') nextPosition.y++;
    if (direction === 'left') nextPosition.x--;
    if (direction === 'right') nextPosition.x++;
    return nextPosition;
  }
}