import { Player } from './player.model';
import { Guard } from './guard.model';
import { GameMap } from './map.model';

export type GameStatus =
  | 'idle'
  | 'running'
  | 'won'
  | 'lost'
  | 'paused';

export interface GameState {
  status: GameStatus;
  map: GameMap;
  player: Player;
  guards: Guard[];
  remainingTime: number;
  score: number;
  objective: string;
  eventMessage: string;
}