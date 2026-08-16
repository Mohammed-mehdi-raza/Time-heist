import { Component, OnInit } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { GameMap } from '../../models/map.model';
import { GameTimerService } from '../../services/game-timer.service';
import { HttpClient } from '@angular/common/http';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-game-screen',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './game-screen.component.html',
  styleUrl: './game-screen.component.scss'
})
export class GameScreenComponent implements OnInit {

  gameMap?: GameMap;

  constructor(
    private readonly http: HttpClient,
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    // private readonly timerService: GameTimerService
  ) {}

  ngOnInit(): void {
    this.http
      .get<GameMap>('assets/maps/map1.json')
      .subscribe((gameMap) => {
        this.gameMap = gameMap;
        this.gameService.startGame(gameMap);
        this.playerService.startListening();
        // this.timerService.start();
      });
  }

}
