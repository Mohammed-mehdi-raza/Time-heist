import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameMap } from '../../models/map.model';
import { Position } from '../../models/position.model';

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
  private spikeState = new Map<string, number>(); // 0=down,1=mid,2=up

  private laserIntervals: number[] = [];
  private laserTimeouts: number[] = [];
  private spikeIntervals: number[] = [];
  private spikeTimeouts: number[] = [];

  private readonly laserPositions: Position[] = [
    { x: 3, y: 2 },
    { x: 12, y: 2 },
    { x: 6, y: 8 },
    { x: 18, y: 3},
    { x: 10, y: 11 }
  ];

  private readonly spikePositions: Position[] = [
    { x: 1, y: 7 },
    { x: 10, y: 3 },
    { x: 20, y: 7 },
    { x: 10, y: 7 },
    { x: 21, y: 12 }
  ];

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

    // spikes cycle through 3 visual states over ~3s (1s each); randomize start offsets
    for (const pos of this.spikePositions) {
      const key = `${pos.x},${pos.y}`;
      this.spikeState.set(key, Math.floor(Math.random() * 3));

      const initialDelay = Math.floor(Math.random() * 3000);
      const t = window.setTimeout(() => {
        const id = window.setInterval(() => {
          const cur = this.spikeState.get(key) ?? 0;
          this.spikeState.set(key, (cur + 1) % 3);
        }, 1000); // advance phase each 1s -> full cycle ~3s
        this.spikeIntervals.push(id);
      }, initialDelay);

      this.spikeTimeouts.push(t);
    }
  }

  ngOnDestroy(): void {
    for (const id of this.laserIntervals) {
      window.clearInterval(id);
    }
    for (const id of this.spikeIntervals) {
      window.clearInterval(id);
    }
    for (const t of this.laserTimeouts) {
      window.clearTimeout(t);
    }
    for (const t of this.spikeTimeouts) {
      window.clearTimeout(t);
    }
  }

  get laserTrapCells(): Position[] {
    return this.laserPositions;
  }

  get spikeTrapCells(): Position[] {
    return this.spikePositions;
  }

  getTrapStyle(position: Position): Record<string, string> {
    const tileWidth = 100 / this.gameMap.width;
    const tileHeight = 100 / this.gameMap.height;

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
    return 'spikeUp.png';
  }

  // position-aware image getters
  getLaserImageFor(position: Position): string {
    const key = `${position.x},${position.y}`;
    const isOn = this.laserState.get(key) ?? false;
    return isOn ? 'laserOn.png' : 'laserOff.png';
  }

  getSpikeImageFor(position: Position): string {
    const key = `${position.x},${position.y}`;
    const phase = this.spikeState.get(key) ?? 0;
    switch (phase) {
      case 0:
        return 'spikeDown.png';
      case 1:
        return 'spikeMid.png';
      default:
        return 'spikeUp.png';
    }
  }
}
