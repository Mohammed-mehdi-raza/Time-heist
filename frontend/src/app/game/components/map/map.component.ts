import { Component, Input, NgModule } from '@angular/core';
import { GameMap, TileType } from '../../models/map.model';
import { PlayerComponent } from '../player/player.component';
import { DiamondComponent } from '../diamond/diamond.component';
import { ExitComponent } from '../exit/exit.component';
import { GuardComponent } from '../guard/guard.component';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [PlayerComponent, DiamondComponent, ExitComponent, GuardComponent,NgClass,CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  @Input({ required: true }) gameMap!: GameMap;

  getTileClass(tile: TileType): string {
    return `tile-${tile}`;
  }
    // 1. Define your tile size here (e.g., 48px, 32px)
  readonly tileSize = 48; 

  // 2. Calculate exact pixel width/height based on the grid
  get mapWidthPx() {
    return this.gameMap.width * this.tileSize;
  }

  get mapHeightPx() {
    return this.gameMap.height * this.tileSize;
  }
}
