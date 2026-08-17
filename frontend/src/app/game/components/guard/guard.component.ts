import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameMap } from '../../models/map.model';
import { GuardConfig } from '../../models/guard-config.model';
import { Position } from '../../models/position.model';
import { GuardService, GuardFacing } from '../../services/guard.service';
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
  imports: [CommonModule],
  templateUrl: './guard.component.html',
  styleUrl: './guard.component.scss'
})
export class GuardComponent implements OnInit, OnDestroy {

  @Input({ required: true })
  gameMap!: GameMap;

  @Input({ required: true })
  guardConfig!: GuardConfig;

  position!: Position;

  guardScale = 1.5;
  currentFrame = 0;

  visionFovDegrees = 90;

  facing: GuardFacing = 'right';

  private currentPatrolIndex = 0;
  private direction = 1;

  private movementTimer?: ReturnType<typeof setInterval>;
  private animationTimer?: ReturnType<typeof setInterval>;

  private readonly animations: Record<GuardType, AnimationConfig> = {
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

  constructor(
    private readonly guardService: GuardService,
    private readonly gameService: GameService
  ) {}

  ngOnInit(): void {
    this.position = {
      ...this.guardConfig.start
    };

    this.currentPatrolIndex = 0;
    this.facing = this.calculateInitialFacing();

    this.syncGuardPosition();

    this.startMovement();
    this.startAnimation();
  }

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

  get facingDirection(): GuardFacing {
    return this.facing;
  }

  get visionRadius(): number {
    return this.guardConfig.visionRange ?? 2.5;
  }

    get visionConeLengthPercent(): number {
    // Scales the length based on visionRange from JSON
    return (this.visionRadius / this.guardScale) * 100;
  }

  get visionConeHeightPercent(): number {
    // The old CSS used height: 70% for a width of 100%.
    // This keeps the exact same narrow shape as before!
    return this.visionConeLengthPercent * 0.7; 
  }

  get currentImage(): string {
    const config = this.animations[this.guardType];

    const frame = this.currentFrame
      .toString()
      .padStart(3, '0');

    const guardFolder = this.getGuardFolder();

    return (
      `assets/sprites/${guardFolder}/` +
      `${config.folder}/` +
      `${config.prefix}_${frame}.png`
    );
  }

  private startMovement(): void {
    this.movementTimer = setInterval(() => {
      const state = this.gameService.currentState;

      if (!state || state.status !== 'running') {
        return;
      }

      this.moveGuard();
      this.checkPlayerDetection();
    }, 30);
  }

  private startAnimation(): void {
    const config = this.animations[this.guardType];

    this.animationTimer = setInterval(() => {
      const state = this.gameService.currentState;

      if (!state || state.status !== 'running') {
        return;
      }

      this.currentFrame++;

      if (this.currentFrame >= config.frameCount) {
        this.currentFrame = 0;
      }
    }, 90);
  }

  private moveGuard(): void {
    const path = this.guardConfig.path;

    if (!path || path.length < 2) {
      return;
    }

    if (
      this.currentPatrolIndex < 0 ||
      this.currentPatrolIndex >= path.length
    ) {
      this.currentPatrolIndex = 0;
    }

    const target = path[this.currentPatrolIndex];

    if (!target) {
      return;
    }

    const oldPosition = this.position;

    const nextPosition = this.guardService.moveTowards(
      oldPosition,
      target,
      0.025
    );

    this.updateFacing(oldPosition, nextPosition);

    this.position = nextPosition;

    this.syncGuardPosition();

    const reached =
      this.position.x === target.x &&
      this.position.y === target.y;

    if (reached) {
      this.moveToNextPoint();
    }
  }

  private updateFacing(
    oldPosition: Position,
    nextPosition: Position
  ): void {

    const dx = nextPosition.x - oldPosition.x;
    const dy = nextPosition.y - oldPosition.y;

    if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
      return;
    }

    if (Math.abs(dx) >= Math.abs(dy)) {
      this.facing = dx >= 0 ? 'right' : 'left';
    } else {
      this.facing = dy >= 0 ? 'down' : 'up';
    }
  }

  private calculateInitialFacing(): GuardFacing {
    const path = this.guardConfig.path;

    if (!path || path.length === 0) {
      return 'right';
    }

    let target = path[0];

    if (
      target.x === this.position.x &&
      target.y === this.position.y &&
      path.length > 1
    ) {
      target = path[1];
    }

    return this.calculateFacingToTarget(target);
  }

  private calculateFacingToTarget(target: Position): GuardFacing {
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;

    if (Math.abs(dx) >= Math.abs(dy)) {
      return dx >= 0 ? 'right' : 'left';
    }

    return dy >= 0 ? 'down' : 'up';
  }

  private checkPlayerDetection(): void {
    const state = this.gameService.currentState;


    if (!state || state.status !== 'running') {
      return;
    }

    const detected = this.guardService.detectPlayer({
      guardPosition: this.position,
      playerPosition: state.player.position,
      facing: this.facing,
      visionRange: this.visionRadius,
      map: this.gameMap,
      fovDegrees: this.visionFovDegrees
    });

    if (detected) {
      this.markGuardAlerted();
      this.gameService.loseGame('You were spotted by a guard');
    }
  }

  private markGuardAlerted(): void {
    const state = this.gameService.currentState;

    if (!state) {
      return;
    }

    this.gameService.updateState({
      guards: state.guards.map((guard) =>
        guard.id === this.guardConfig.id
          ? {
              ...guard,
              isAlerted: true
            }
          : guard
      )
    });
  }

  private syncGuardPosition(): void {
    const currentState = this.gameService.currentState;

    if (!currentState) {
      return;
    }

    const guards = currentState.guards ?? [];

    const existingGuard = guards.find(
      (guard) => guard.id === this.guardConfig.id
    );

    const updatedGuard = {
      id: this.guardConfig.id,
      position: { ...this.position },
      patrolPoints: [...(this.guardConfig.path ?? [])],
      currentPatrolIndex: this.currentPatrolIndex,
      visionRange: this.visionRadius,
      isAlerted: existingGuard?.isAlerted ?? false
    };

    if (existingGuard) {
      this.gameService.updateState({
        guards: guards.map((guard) =>
          guard.id === this.guardConfig.id
            ? updatedGuard
            : guard
        )
      });
    } else {
      this.gameService.updateState({
        guards: [
          ...guards,
          updatedGuard
        ]
      });
    }
  }

  private moveToNextPoint(): void {
    this.currentPatrolIndex += this.direction;

    if (this.currentPatrolIndex >= this.guardConfig.path.length) {
      this.direction = -1;
      this.currentPatrolIndex = this.guardConfig.path.length - 2;
      return;
    }

    if (this.currentPatrolIndex < 0) {
      this.direction = 1;
      this.currentPatrolIndex = 1;
    }
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

  ngOnDestroy(): void {
    if (this.movementTimer) {
      clearInterval(this.movementTimer);
    }

    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }
  }
}