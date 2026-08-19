import { TestBed } from '@angular/core/testing';

import { GameMap } from '../models/map.model';
import { GameService } from './game.service';
import { CollisionService } from './collision.service';

describe('CollisionService', () => {
  let service: CollisionService;
  let gameService: GameService;

  const map: GameMap = {
    id: 'test-map',
    tileSize: 48,
    width: 6,
    height: 6,
    tiles: [
      ['floor', 'floor', 'floor', 'floor', 'floor', 'floor'],
      ['floor', 'floor', 'floor', 'floor', 'floor', 'floor'],
      ['floor', 'floor', 'floor', 'floor', 'floor', 'floor'],
      ['floor', 'floor', 'floor', 'floor', 'floor', 'floor'],
      ['floor', 'floor', 'floor', 'floor', 'floor', 'floor'],
      ['floor', 'floor', 'floor', 'floor', 'floor', 'floor']
    ],
    playerStart: { x: 0, y: 0 },
    exitPosition: { x: 5, y: 5 },
    diamondPosition: { x: 2, y: 2 }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    gameService = new GameService();
    service = new CollisionService(gameService);
    gameService.startGame(map);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not collect the diamond when the player is one tile away', () => {
    service.checkInteractions({ x: 2, y: 1 });

    expect(gameService.currentState?.player.hasDiamond).toBeFalse();
  });

  it('should collect the diamond only when the player steps on the diamond tile', () => {
    service.checkInteractions({ x: 2, y: 2 });

    expect(gameService.currentState?.player.hasDiamond).toBeTrue();
  });

  it('should trigger a game over only when the player collides with a guard tile', () => {
    const startGuard = gameService.currentState!.guards[0];

    gameService.updateState({
      guards: [
        {
          ...startGuard,
          position: { x: 3, y: 1 },
          visionRange: 2.5
        }
      ]
    });

    service.checkInteractions({ x: 2, y: 1 });
    expect(gameService.currentState?.status).toBe('running');

    service.checkInteractions({ x: 3, y: 1 });
    expect(gameService.currentState?.status).toBe('lost');
    expect(gameService.currentState?.eventMessage).toContain('guard');
  });
});
