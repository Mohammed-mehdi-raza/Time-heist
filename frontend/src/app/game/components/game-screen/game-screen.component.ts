import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  GuardComponent,
  GuardType,
  GuardAnimation
} from '../guard/guard.component';

interface PatrolPoint {
  x: number;
  y: number;
}

interface TestGuard {
  id: number;

  type: GuardType;

  x: number;
  y: number;

  speed: number;

  animation: GuardAnimation;

  patrolPoints: PatrolPoint[];

  currentPoint: number;
}

@Component({
  selector: 'app-game-screen',
  standalone: true,

  imports: [
    GuardComponent
  ],

  templateUrl: './game-screen.component.html',

  styleUrl: './game-screen.component.scss'
})
export class GameScreenComponent
  implements OnInit, OnDestroy {


  /*
   * =====================================================
   * TEST GUARDS
   * =====================================================
   */

  guards: TestGuard[] = [

    {
      id: 1,

      type: 'guard1',

      x: 100,
      y: 100,

      speed: 1.2,

      animation: 'walking',

      currentPoint: 1,

      patrolPoints: [
        { x: 100, y: 100 },
        { x: 500, y: 100 },
        { x: 500, y: 350 },
        { x: 100, y: 350 }
      ]
    },

    {
      id: 2,

      type: 'guard3',

      x: 600,
      y: 200,

      speed: 1,

      animation: 'walking',

      currentPoint: 1,

      patrolPoints: [
        { x: 600, y: 200 },
        { x: 850, y: 200 },
        { x: 850, y: 450 },
        { x: 600, y: 450 }
      ]
    }

  ];


  /*
   * =====================================================
   * GAME LOOP
   * =====================================================
   */

  private animationFrameId?: number;


  ngOnInit(): void {

    this.startGameLoop();

  }


  /*
   * =====================================================
   * START LOOP
   * =====================================================
   */

  private startGameLoop(): void {

    const loop = () => {

      this.updateGuards();

      this.animationFrameId =
        requestAnimationFrame(loop);
    };

    this.animationFrameId =
      requestAnimationFrame(loop);
  }


  /*
   * =====================================================
   * UPDATE GUARDS
   * =====================================================
   */

  private updateGuards(): void {

    for (const guard of this.guards) {

      this.moveGuard(guard);

    }
  }


  /*
   * =====================================================
   * MOVE ONE GUARD
   * =====================================================
   */

  private moveGuard(guard: TestGuard): void {

    const target =
      guard.patrolPoints[
        guard.currentPoint
      ];

    const dx =
      target.x - guard.x;

    const dy =
      target.y - guard.y;

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    /*
     * Reached patrol point
     */

    if (distance <= guard.speed) {

      guard.x = target.x;

      guard.y = target.y;


      /*
       * Go to next point
       */

      guard.currentPoint++;

      if (
        guard.currentPoint >=
        guard.patrolPoints.length
      ) {

        guard.currentPoint = 0;
      }

      return;
    }


    /*
     * Move towards target
     */

    guard.x +=
      (dx / distance) *
      guard.speed;

    guard.y +=
      (dy / distance) *
      guard.speed;

  }


  /*
   * =====================================================
   * CLEANUP
   * =====================================================
   */

  ngOnDestroy(): void {

    if (this.animationFrameId !== undefined) {

      cancelAnimationFrame(
        this.animationFrameId
      );
    }
  }

}