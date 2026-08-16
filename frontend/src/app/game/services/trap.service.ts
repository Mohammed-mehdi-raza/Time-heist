import { Injectable } from '@angular/core';
import { Position } from '../models/position.model';

@Injectable({ providedIn: 'root' })
export class TrapService {
  // keep same spike positions as the component so visuals and logic match
  readonly spikePositions: Position[] = [
    { x: 1, y: 7 },
    { x: 10, y: 3 },
    { x: 20, y: 7 },
    { x: 10, y: 7 },
    { x: 21, y: 12 }
  ];

  // 0=down,1=mid,2=up
  private spikeState = new Map<string, number>();

  private spikeIntervals: number[] = [];
  private spikeTimeouts: number[] = [];

  constructor() {}

  start(): void {
    // initialize state and start cycling
    for (const pos of this.spikePositions) {
      const key = `${pos.x},${pos.y}`;
      this.spikeState.set(key, Math.floor(Math.random() * 3));

      const initialDelay = Math.floor(Math.random() * 3000);
      const t = window.setTimeout(() => {
        const id = window.setInterval(() => {
          const cur = this.spikeState.get(key) ?? 0;
          this.spikeState.set(key, (cur + 1) % 3);
        }, 1000);
        this.spikeIntervals.push(id);
      }, initialDelay);

      this.spikeTimeouts.push(t);
    }
  }

  stop(): void {
    for (const id of this.spikeIntervals) window.clearInterval(id);
    for (const t of this.spikeTimeouts) window.clearTimeout(t);
    this.spikeIntervals = [];
    this.spikeTimeouts = [];
  }

  isSpikeUp(position: Position): boolean {
    const key = `${position.x},${position.y}`;
    return this.spikeState.get(key) === 2;
  }

  getSpikeImageFor(position: Position): string {
    const key = `${position.x},${position.y}`;
    const phase = this.spikeState.get(key) ?? 0;
    switch (phase) {
      case 0:
        return 'spike_down.png';
      case 1:
        return 'spike_mid.png';
      default:
        return 'spike_up.png';
    }
  }
}
