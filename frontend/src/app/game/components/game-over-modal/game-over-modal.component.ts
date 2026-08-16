import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-over-modal',
  standalone: true,
  imports: [],
  templateUrl: './game-over-modal.component.html',
  styleUrl: './game-over-modal.component.scss'
})
export class GameOverModalComponent {
  @Input() reason: string = 'CAUGHT BY GUARD!';
  @Output() restart = new EventEmitter<void>();
  @Output() mainMenu = new EventEmitter<void>();

  onRestart() {
    this.restart.emit();
  }

  onMainMenu() {
    this.mainMenu.emit();
  }
}
