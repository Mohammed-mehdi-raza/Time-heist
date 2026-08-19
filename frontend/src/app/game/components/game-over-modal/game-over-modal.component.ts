import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-over-modal',
  standalone: true,
  imports: [],
  templateUrl: './game-over-modal.component.html',
  styleUrl: './game-over-modal.component.scss'
})
export class GameOverModalComponent {

  constructor(private router:Router,private gameService:GameService){
  }

  @Input() reason: string = 'CAUGHT BY GUARD!';
  @Output() restart = new EventEmitter<void>();

  onRestart() {
    this.gameService.resetGame();
    this.restart.emit();
  }

  onMainMenu() {
    this.gameService.resetGame();
    this.router.navigate(['']);
  }
}
