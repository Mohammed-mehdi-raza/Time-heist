import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameMap } from '../../models/map.model';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-exit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exit.component.html',
  styleUrl: './exit.component.scss'
})
export class ExitComponent {
  @Input() gameMap!: GameMap;

  readonly gameState$ = this.gameService.gameState$;

  get hasDiamond(): boolean {
    return this.gameService.currentState?.player.hasDiamond ?? false;
  }

  get exitTransform(): string {
    const tileSize = this.gameMap?.tileSize ?? 1;
    const exitPosition = this.gameMap?.exitPosition ?? { x: 0, y: 0 };
    const offsetX = 60;
    const offsetY = -8;

    return `translate(${exitPosition.x * tileSize + offsetX}px, ${exitPosition.y * tileSize + offsetY}px)`;
  }

  constructor(private readonly gameService: GameService) {}
}
