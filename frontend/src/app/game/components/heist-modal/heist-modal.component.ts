import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface HeistStats {
  timeTaken: string;
  cctvAlerts: number;
  trapsHit: number;
  scoreEarned: number;
  totalScore: number;
}

@Component({
  selector: 'app-heist-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heist-modal.component.html',
  styleUrls: ['./heist-modal.component.scss']
})
export class HeistModalComponent {
  @Input() stats: HeistStats = {
    timeTaken: '02:41',
    cctvAlerts: 1,
    trapsHit: 2,
    scoreEarned: 820,
    totalScore: 1320
  };

  constructor(private readonly router: Router) {}

  @Output() nextLevel = new EventEmitter<void>();

  onNextLevel(): void {
    this.nextLevel.emit();
  }

  onMainMenu(): void {
    this.router.navigate(['']);
  }
}