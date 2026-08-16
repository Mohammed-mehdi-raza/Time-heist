import { Component, Input } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { GameMap } from '../../models/map.model'; // <--- Import GameMap

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  
  // 1. Receive gameMap directly from MapComponent
  @Input({ required: true }) gameMap!: GameMap;

  playerScale = 1.5;

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
}