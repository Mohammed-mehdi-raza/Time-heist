import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { GameMap } from '../../models/map.model';
import { Direction } from '../../models/player.model';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit, OnDestroy {

  @Input({ required: true }) gameMap!: GameMap;

  playerScale = 1.5;

  frame = 0;

  private animationTimer?: number;
  private lastDirection: Direction | null = null;
  private lastFrameTime = 0;

  private readonly basePath =
    'assets/sprites/Character sprite PNG/PNG Sequences/Walking/';

  private readonly rightFrames = Array.from(
    { length: 24 },
    (_, i) =>
      `${this.basePath}0_Fallen_Angels_Walking_${String(i).padStart(3, '0')}.png`
  );

  private readonly upFrames = [
    `${this.basePath}up1.png`,
    `${this.basePath}up2.png`
  ];

  private readonly downFrames = [
    `${this.basePath}down1.png`,
    `${this.basePath}down2.png`
  ];

  fallbackSrc = this.rightFrames[0];

  constructor(
    public readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  get player() {
    return this.gameService.currentState?.player;
  }

  get position() {
    return this.player?.position;
  }

  get direction(): Direction {
    return this.player?.direction ?? 'down';
  }

  get currentFrames(): string[] {
    switch (this.direction) {
      case 'up':
        return this.upFrames;

      case 'down':
        return this.downFrames;

      case 'left':
      case 'right':
      default:
        return this.rightFrames;
    }
  }

  get spriteUrl(): string {
    const frames = this.currentFrames;
    const safeFrame = this.frame % frames.length;
    return frames[safeFrame];
  }

  get shouldFlip(): boolean {
    return this.direction === 'left';
  }

  ngOnInit(): void {
    this.lastDirection = this.direction;
    this.preloadCurrentFrames();

    this.animationTimer = window.setInterval(() => {
      this.updateFrame();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.animationTimer !== undefined) {
      clearInterval(this.animationTimer);
    }
  }

  private updateFrame(): void {
    const state = this.gameService.currentState;

    if (!state || state.status !== 'running' || !this.playerService.isMoving) {
      if (this.frame !== 0) {
        this.frame = 0;
        this.cdr.markForCheck();
      }
      return;
    }

    if (this.direction !== this.lastDirection) {
      this.lastDirection = this.direction;
      this.frame = 0;
      this.lastFrameTime = performance.now();
      this.preloadCurrentFrames();
      this.cdr.markForCheck();
      return;
    }

    const frames = this.currentFrames;

    if (frames.length <= 1) {
      return;
    }

    const now = performance.now();

    const animationSpeed =
      this.direction === 'up' || this.direction === 'down' ? 220 : 80;

    if (now - this.lastFrameTime >= animationSpeed) {
      this.lastFrameTime = now;
      this.frame = (this.frame + 1) % frames.length;
      this.cdr.markForCheck();
    }
  }

  private preloadCurrentFrames(): void {
    this.currentFrames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.onerror = null;
    target.src = this.fallbackSrc;
  }
}