import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

export interface HeistStats {
  timeTaken: string;
  cctvAlerts: number;
  trapsHit: number;
  scoreEarned: number;
  totalScore: number | string;
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

  constructor(private readonly router: Router,private gameService: GameService) {}

  @Output() nextLevel = new EventEmitter<void>();

  isScoreLoading(): boolean {
    return typeof this.stats.totalScore === 'string';
  }

  onNextLevel(): void {
    this.nextLevel.emit();
  }

  onMainMenu(): void {
    this.gameService.resetGame();
    this.router.navigate(['']);
  }
}