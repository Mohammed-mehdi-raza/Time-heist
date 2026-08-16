import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameMap } from '../../models/map.model';
import { GuardConfig } from '../../models/guard-config.model';
import { Position } from '../../models/position.model';
import { GuardService } from '../../services/guard.service';
import { GameService } from '../../services/game.service';

type GuardType = 'guard1' | 'guard2' | 'guard3';

interface AnimationConfig {
  folder: string;
  prefix: string;
  frameCount: number;
}

@Component({
  selector: 'app-guard',
  standalone: true,
  imports: [],
  templateUrl: './guard.component.html',
  styleUrl: './guard.component.scss'
})
export class GuardComponent implements OnInit, OnDestroy {

  @Input({ required: true })
  gameMap!: GameMap;

  @Input({ required: true })
  guardConfig!: GuardConfig;

  constructor(
    private readonly guardService: GuardService,
    private readonly gameService: GameService
  ) { }

  get guardType(): GuardType {
    switch (this.guardConfig.id) {
      case 'guard_2':
        return 'guard2';

      case 'guard_3':
        return 'guard3';

      default:
        return 'guard1';
    }
  }

  position!: Position;
  guardScale = 1.5;
  currentFrame = 0;

  private currentPatrolIndex = 0;
  private direction = 1;

  private movementTimer?: ReturnType<typeof setInterval>;
  private animationTimer?: ReturnType<typeof setInterval>;
  private readonly animations: Record<
    GuardType,
    AnimationConfig
  > = {

      guard1: {
        folder: 'Walking',
        prefix: 'Wraith_03_Moving Forward',
        frameCount: 12
      },

      guard2: {
        folder: 'Walking',
        prefix: '0_Fallen_Angels_Walking',
        frameCount: 24
      },

      guard3: {
        folder: 'Walking',
        prefix: 'Wraith_02_Moving Forward',
        frameCount: 12
      }
    };

  ngOnInit(): void {
    this.position = {
      ...this.guardConfig.start
    };
    this.currentPatrolIndex = 0;
    this.startMovement();
    this.startAnimation();
  }

  get currentImage(): string {
    const config =
      this.animations[this.guardType];
    const frame =
      this.currentFrame
        .toString()
        .padStart(3, '0');

    const guardFolder =
      this.getGuardFolder();

    return (
      `assets/sprites/${guardFolder}/` +
      `${config.folder}/` +
      `${config.prefix}_${frame}.png`
    );
  }

  private getGuardFolder(): string {
    switch (this.guardType) {
      case 'guard2':
        return 'Guard 2 PNG';
      case 'guard3':
        return 'Guard 3 PNG';
      default:
        return 'Guard 1 PNG';
    }
  }

  private startAnimation(): void {
    const config =
      this.animations[this.guardType];

    this.animationTimer =
      setInterval(() => {
        this.currentFrame++;
        if (
          this.currentFrame >=
          config.frameCount
        ) {
          this.currentFrame = 0;
        }
      }, 90);
  }

  private startMovement(): void {

    this.movementTimer =
      setInterval(() => {
        this.moveGuard();
      }, 30);
  }

  get visionRadius(): number {
    return this.guardConfig.visionRange ?? 2.5;
  }

  private syncGuardPosition(): void {
    const currentState = this.gameService.currentState;

    if (!currentState) {
      return;
    }

    const existingGuard = currentState.guards.find((guard) => guard.id === this.guardConfig.id);

    this.gameService.updateState({
      guards: currentState.guards.map((guard) =>
        guard.id === this.guardConfig.id
          ? {
              ...guard,
              position: { ...this.position },
              patrolPoints: [...this.guardConfig.path],
              currentPatrolIndex: this.currentPatrolIndex,
              visionRange: this.visionRadius,
              isAlerted: guard.isAlerted
            }
          : guard
      )
    });
  }

  private moveGuard(): void {

    const path = this.guardConfig.path;

    if (!path || path.length < 2) {
      return;
    }

    const target = path[this.currentPatrolIndex];

    this.position =
      this.guardService.moveTowards(
        this.position,
        target,
        0.025
      );

    this.syncGuardPosition();

    const reached =
      this.position.x === target.x &&
      this.position.y === target.y;

    if (reached) {
      this.moveToNextPoint();
    }
  }

  private moveToNextPoint(): void {

    this.currentPatrolIndex +=
      this.direction;

    if (
      this.currentPatrolIndex >=
      this.guardConfig.path.length
    ) {

      this.direction = -1;

      this.currentPatrolIndex =
        this.guardConfig.path.length - 2;

      return;
    }

    if (this.currentPatrolIndex < 0) {

      this.direction = 1;

      this.currentPatrolIndex = 1;
    }
  }

  ngOnDestroy(): void {

    if (this.movementTimer) {
      clearInterval(this.movementTimer);
    }

    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }
  }
}