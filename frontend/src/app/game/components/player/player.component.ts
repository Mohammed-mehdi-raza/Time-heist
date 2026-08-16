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

  playerScale = 1.8;

  frame = 0;

  private animationTimer?: number;
  private lastDirection: Direction | null = null;
  private lastFrameTime = 0;

  private readonly frameCount = 20;
  private readonly animationSpeed = 80;

  private readonly assetsRoot = 'assets';
  private readonly charFolder = 'Newchar';

  private readonly backFrames = this.buildFrames('Back - Walking');
  private readonly frontFrames = this.buildFrames('Front - Walking');
  private readonly leftFrames = this.buildFrames('Left - Walking');
  private readonly rightFrames = this.buildFrames('Right - Walking');

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
        return this.backFrames;

      case 'down':
        return this.frontFrames;

      case 'left':
        return this.leftFrames;

      case 'right':
        return this.rightFrames;

      default:
        return this.frontFrames;
    }
  }

  get spriteUrl(): string {
    const frames = this.currentFrames;
    const safeFrame = this.frame % frames.length;
    return frames[safeFrame];
  }

  ngOnInit(): void {
    this.lastDirection = this.direction;
    this.preloadAllFrames();

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
      this.cdr.markForCheck();
      return;
    }

    const frames = this.currentFrames;

    if (frames.length <= 1) {
      return;
    }

    const now = performance.now();

    if (now - this.lastFrameTime >= this.animationSpeed) {
      this.lastFrameTime = now;
      this.frame = (this.frame + 1) % frames.length;
      this.cdr.markForCheck();
    }
  }

  private buildFrames(folderName: string): string[] {
    return Array.from({ length: this.frameCount }, (_, index) => {
      const frameNumber = String(index).padStart(3, '0');
      const fileName = `${folderName}_${frameNumber}.png`;

      return [
        this.assetsRoot,
        this.charFolder,
        folderName,
        fileName
      ]
        .map(encodeURIComponent)
        .join('/');
    });
  }

  private preloadAllFrames(): void {
    const allFrames = [
      ...this.backFrames,
      ...this.frontFrames,
      ...this.leftFrames,
      ...this.rightFrames
    ];

    allFrames.forEach((src) => {
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