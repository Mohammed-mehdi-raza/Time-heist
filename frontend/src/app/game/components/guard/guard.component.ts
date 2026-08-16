import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

export type GuardType = 'guard1' | 'guard2' | 'guard3';

export type GuardAnimation =
  | 'idle'
  | 'idleBlink'
  | 'walking'
  | 'attacking'
  | 'casting'
  | 'dying'
  | 'hurt'
  | 'taunt'
  | 'fallingDown'
  | 'jumpLoop'
  | 'jumpStart'
  | 'kicking'
  | 'running'
  | 'runSlashing'
  | 'runThrowing'
  | 'sliding'
  | 'slashing'
  | 'slashingAir'
  | 'throwing'
  | 'throwingAir';

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
export class GuardComponent implements OnChanges, OnDestroy {

  // Which guard
  @Input() guardType: GuardType = 'guard1';

  // Which animation
  @Input() animation: GuardAnimation = 'idle';

  // Position on the map
  @Input() x = 0;
  @Input() y = 0;

  // Size of the displayed guard
  @Input() width = 100;
  @Input() height = 100;

  // Animation speed
  @Input() frameSpeed = 100;

  // Should animation repeat?
  @Input() loop = true;

  currentFrame = 0;

  private animationTimer?: ReturnType<typeof setInterval>;

  /*
   * =========================================================
   * GUARD 1 - WRAITH 03
   * =========================================================
   */

  private readonly guard1Animations: Record<string, AnimationConfig> = {

    idle: {
      folder: 'Idle',
      prefix: 'Wraith_03_Idle',
      frameCount: 12
    },

    idleBlink: {
      folder: 'Idle Blink',
      prefix: 'Wraith_03_Idle Blinking',
      frameCount: 12
    },

    walking: {
      folder: 'Walking',
      prefix: 'Wraith_03_Moving Forward',
      frameCount: 12
    },

    attacking: {
      folder: 'Attacking',
      prefix: 'Wraith_03_Attack',
      frameCount: 12
    },

    casting: {
      folder: 'Casting Spells',
      prefix: 'Wraith_03_Casting Spells',
      frameCount: 18
    },

    dying: {
      folder: 'Dying',
      prefix: 'Wraith_03_Dying',
      frameCount: 15
    },

    hurt: {
      folder: 'Hurt',
      prefix: 'Wraith_03_Hurt',
      frameCount: 12
    },

    taunt: {
      folder: 'Taunt',
      prefix: 'Wraith_03_Taunt',
      frameCount: 18
    }
  };


  /*
   * =========================================================
   * GUARD 2 - FALLEN ANGELS
   * =========================================================
   */

  private readonly guard2Animations: Record<string, AnimationConfig> = {

    idle: {
      folder: 'Idle',
      prefix: '0_Fallen_Angels_Idle',
      frameCount: 18
    },

    idleBlink: {
      folder: 'Idle Blinking',
      prefix: '0_Fallen_Angels_Idle Blinking',
      frameCount: 18
    },

    walking: {
      folder: 'Walking',
      prefix: '0_Fallen_Angels_Walking',
      frameCount: 24
    },

    running: {
      folder: 'Running',
      prefix: '0_Fallen_Angels_Running',
      frameCount: 12
    },

    kicking: {
      folder: 'Kicking',
      prefix: '0_Fallen_Angels_Kicking',
      frameCount: 12
    },

    dying: {
      folder: 'Dying',
      prefix: '0_Fallen_Angels_Dying',
      frameCount: 15
    },

    hurt: {
      folder: 'Hurt',
      prefix: '0_Fallen_Angels_Hurt',
      frameCount: 12
    },

    fallingDown: {
      folder: 'Falling Down',
      prefix: '0_Fallen_Angels_Falling Down',
      frameCount: 6
    },

    jumpLoop: {
      folder: 'Jump Loop',
      prefix: '0_Fallen_Angels_Jump Loop',
      frameCount: 6
    },

    jumpStart: {
      folder: 'Jump Start',
      prefix: '0_Fallen_Angels_Jump Start',
      frameCount: 6
    },

    runSlashing: {
      folder: 'Run Slashing',
      prefix: '0_Fallen_Angels_Run Slashing',
      frameCount: 12
    },

    runThrowing: {
      folder: 'Run Throwing',
      prefix: '0_Fallen_Angels_Run Throwing',
      frameCount: 12
    },

    sliding: {
      folder: 'Sliding',
      prefix: '0_Fallen_Angels_Sliding',
      frameCount: 6
    },

    slashing: {
      folder: 'Slashing',
      prefix: '0_Fallen_Angels_Slashing',
      frameCount: 12
    },

    slashingAir: {
      folder: 'Slashing in The Air',
      prefix: '0_Fallen_Angels_Slashing in The Air',
      frameCount: 12
    },

    throwing: {
      folder: 'Throwing',
      prefix: '0_Fallen_Angels_Throwing',
      frameCount: 12
    },

    throwingAir: {
      folder: 'Throwing in The Air',
      prefix: '0_Fallen_Angels_Throwing in The Air',
      frameCount: 12
    }
  };


  /*
   * =========================================================
   * GUARD 3 - WRAITH 02
   * =========================================================
   */

  private readonly guard3Animations: Record<string, AnimationConfig> = {

    idle: {
      folder: 'Idle',
      prefix: 'Wraith_02_Idle',
      frameCount: 12
    },

    idleBlink: {
      folder: 'Idle Blink',
      prefix: 'Wraith_02_Idle Blinking',
      frameCount: 12
    },

    walking: {
      folder: 'Walking',
      prefix: 'Wraith_02_Moving Forward',
      frameCount: 12
    },

    attacking: {
      folder: 'Attacking',
      prefix: 'Wraith_02_Attack',
      frameCount: 12
    },

    casting: {
      folder: 'Casting Spells',
      prefix: 'Wraith_02_Casting Spells',
      frameCount: 18
    },

    dying: {
      folder: 'Dying',
      prefix: 'Wraith_02_Dying',
      frameCount: 15
    },

    hurt: {
      folder: 'Hurt',
      prefix: 'Wraith_02_Hurt',
      frameCount: 12
    },

    taunt: {
      folder: 'Taunt',
      prefix: 'Wraith_02_Taunt',
      frameCount: 18
    }
  };


  /*
   * =========================================================
   * GET CURRENT ANIMATION
   * =========================================================
   */

  private get currentAnimationConfig(): AnimationConfig {

    let animations: Record<string, AnimationConfig>;

    switch (this.guardType) {

      case 'guard2':
        animations = this.guard2Animations;
        break;

      case 'guard3':
        animations = this.guard3Animations;
        break;

      default:
        animations = this.guard1Animations;
    }

    return animations[this.animation] ?? animations['idle'];
  }


  /*
   * =========================================================
   * GUARD FOLDER
   * =========================================================
   */

  private get guardFolder(): string {

    switch (this.guardType) {

      case 'guard2':
        return 'Guard 2 PNG';

      case 'guard3':
        return 'Guard 3 PNG';

      default:
        return 'Guard 1 PNG';
    }
  }


  /*
   * =========================================================
   * CURRENT IMAGE
   * =========================================================
   */

  get currentImage(): string {

    const config = this.currentAnimationConfig;

    const frameNumber = this.currentFrame
      .toString()
      .padStart(3, '0');

    return [
      '/assets/sprites',
      encodeURIComponent(this.guardFolder),
      encodeURIComponent(config.folder),
      `${encodeURIComponent(config.prefix)}_${frameNumber}.png`
    ].join('/');
  }


  /*
   * =========================================================
   * START ANIMATION WHEN INPUT CHANGES
   * =========================================================
   */

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['guardType'] ||
      changes['animation'] ||
      changes['frameSpeed']
    ) {

      this.currentFrame = 0;

      this.startAnimation();
    }
  }


  /*
   * =========================================================
   * ANIMATION LOOP
   * =========================================================
   */

  private startAnimation(): void {

    this.stopAnimation();

    const config = this.currentAnimationConfig;

    this.animationTimer = setInterval(() => {

      this.currentFrame++;

      if (this.currentFrame >= config.frameCount) {

        if (this.loop) {

          this.currentFrame = 0;

        } else {

          this.currentFrame = config.frameCount - 1;

          this.stopAnimation();
        }
      }

    }, this.frameSpeed);
  }


  /*
   * =========================================================
   * STOP ANIMATION
   * =========================================================
   */

  private stopAnimation(): void {

    if (this.animationTimer) {

      clearInterval(this.animationTimer);

      this.animationTimer = undefined;
    }
  }


  /*
   * =========================================================
   * CLEANUP
   * =========================================================
   */

  ngOnDestroy(): void {

    this.stopAnimation();
  }
}