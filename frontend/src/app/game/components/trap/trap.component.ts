import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameMap } from '../../models/map.model';
import { Position } from '../../models/position.model';
import { TrapService } from '../../services/trap.service';

@Component({
  selector: 'app-trap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trap.component.html',
  styleUrl: './trap.component.scss'
})
export class TrapComponent implements OnInit, OnDestroy {
  @Input({ required: true }) gameMap!: GameMap;
  // per-trap state so each trap can have independent timing
  private laserState = new Map<string, boolean>();
  private laserIntervals: number[] = [];
  private laserTimeouts: number[] = [];

  private readonly laserPositions: Position[] = [
    { x: 3, y: 2 },
    { x: 12, y: 2 },
    { x: 6, y: 8 },
    { x: 18, y: 3},
    { x: 10, y: 11 }
  ];

  constructor(private readonly trapService: TrapService) {}

  ngOnInit(): void {
    // start independent timers per-laser so their on/off cycles are randomized
    for (const pos of this.laserPositions) {
      const key = `${pos.x},${pos.y}`;
      // initial random on/off
      this.laserState.set(key, Math.random() > 0.5);

      const initialDelay = Math.floor(Math.random() * 3000);
      const t = window.setTimeout(() => {
        const id = window.setInterval(() => {
          const cur = this.laserState.get(key) ?? false;
          this.laserState.set(key, !cur);
        }, 3000);
        this.laserIntervals.push(id);
      }, initialDelay);

      this.laserTimeouts.push(t);
    }

    // delegate spike timing/state to TrapService
    this.trapService.start();
  }

  ngOnDestroy(): void {
    for (const id of this.laserIntervals) {
      window.clearInterval(id);
    }
    for (const t of this.laserTimeouts) {
      window.clearTimeout(t);
    }
    this.trapService.stop();
  }

  get laserTrapCells(): Position[] {
    return this.laserPositions;
  }

  get spikeTrapCells(): Position[] {
    return this.trapService.spikePositions;
  }

  getTrapStyle(position: Position): Record<string, string> {
    const tileWidth = 100 / this.gameMap.width;
    const tileHeight = 100 / this.gameMap.height;

    // make spike visuals smaller and centered within the tile
    const isSpike = this.trapService.spikePositions.some(p => p.x === position.x && p.y === position.y);
    if (isSpike) {
      const scale = 1.0; // spikes occupy 100% of the tile
      const w = tileWidth * scale;
      const h = tileHeight * scale;
      const left = position.x * tileWidth + (tileWidth - w) / 2;
      const top = position.y * tileHeight + (tileHeight - h) / 2;

      return {
        left: `${left}%`,
        top: `${top}%`,
        width: `${w}%`,
        height: `${h}%`
      };
    }

    return {
      left: `${position.x * tileWidth}%`,
      top: `${position.y * tileHeight}%`,
      width: `${tileWidth}%`,
      height: `${tileHeight}%`
    };
  }

  getLaserImage(): string {
    // not used: provide default fallback
    return 'laserOn.png';
  }

  getSpikeImage(): string {
    // not used: provide default fallback
    return 'spike_up.png';
  }

  // position-aware image getters
  getLaserImageFor(position: Position): string {
    const key = `${position.x},${position.y}`;
    const isOn = this.laserState.get(key) ?? false;
    return isOn ? 'laserOn.png' : 'laserOff.png';
  }

  getSpikeImageFor(position: Position): string {
    return this.trapService.getSpikeImageFor(position);
  }
}
