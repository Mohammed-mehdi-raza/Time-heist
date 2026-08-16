import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { Input } from '@angular/core';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
// export class PlayerComponent {

//   constructor(
//     public readonly gameService: GameService,
//     private readonly playerService: PlayerService
//   ) {}

//   get player() {
//     return this.gameService.currentState?.player;
//   }

//   get position() {
//     return this.player?.position;
//   }

//   get direction() {
//     return this.player?.direction;
//   }
//   get mapWidth() {
//     return this.gameService.currentState?.map.width || 1;
//   }

//   get mapHeight() {
//     return this.gameService.currentState?.map.height || 1;
//   }
// }
export class PlayerComponent {
  // Receive tile size from MapComponent
  @Input() tileSize = 48; 

  constructor(
    public readonly gameService: GameService,
    private readonly playerService: PlayerService
  ) {}

  get player() {
    return this.gameService.currentState?.player;
  }

  get position() {
    return this.player?.position;
  }

  // Calculate exact pixel position (center of the tile)
  get leftPx() {
    return (this.position!.x + 0.5) * this.tileSize;
  }

  get topPx() {
    return (this.position!.y + 0.5) * this.tileSize;
  }
}