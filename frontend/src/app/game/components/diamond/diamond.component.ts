import { Component, Input } from '@angular/core';
import { GameMap } from '../../models/map.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diamond',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diamond.component.html',
  styleUrls: ['./diamond.component.scss']
})
export class DiamondComponent {
  @Input({ required: true }) gameMap!: GameMap;
} 
