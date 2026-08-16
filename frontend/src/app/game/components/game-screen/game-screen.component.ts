import {Component,OnDestroy,OnInit} from '@angular/core';
import {GuardComponent,GuardType,GuardAnimation} from '../guard/guard.component';
// import { Component, OnInit } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { GameMap } from '../../models/map.model';
import { GameTimerService } from '../../services/game-timer.service';
import { HttpClient } from '@angular/common/http';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';

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
    GuardComponent,
    MapComponent
  ],
  templateUrl: './game-screen.component.html',
  styleUrl: './game-screen.component.scss'
})

export class GameScreenComponent implements OnInit, OnDestroy {

  gameMap?: GameMap;

  constructor(
    private readonly http: HttpClient,
    // private readonly gameService: GameService,
    // private readonly playerService: PlayerService,
    // private readonly timerService: GameTimerService
  ) {}

  ngOnInit(): void {
    this.http
      .get<GameMap>('assets/maps/map1.json')
      .subscribe((gameMap) => {
        this.gameMap = gameMap;
        this.startGameLoop();
        // this.gameService.startGame(gameMap);
        // this.playerService.startListening();
        // this.timerService.start();
      });
  }


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