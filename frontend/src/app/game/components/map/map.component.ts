import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameMap, TileType } from '../../models/map.model';
import { Position } from '../../models/position.model';
import { ExitComponent } from "../exit/exit.component";
import { DiamondComponent } from '../diamond/diamond.component';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, ExitComponent,DiamondComponent,PlayerComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  @Input({ required: true }) gameMap!: GameMap;

  getTileClass(tile: TileType): string {
    return `tile-${tile}`;
  }
    

  get wallPositions(): Position[] {
    if (!this.gameMap?.tiles) {
      return [];
    }

    const walls: Position[] = [];

    this.gameMap.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 'wall') {
          walls.push({ x, y });
        }
      });
    });

    return walls;
  }

  getWallStyle(position: Position): Record<string, string> {
    const tileWidth = 100 / this.gameMap.width;
    const tileHeight = 100 / this.gameMap.height;

    return {
      left: `${position.x * tileWidth}%`,
      top: `${position.y * tileHeight}%`,
      width: `${tileWidth}%`,
      height: `${tileHeight}%`
    };
  }
}
