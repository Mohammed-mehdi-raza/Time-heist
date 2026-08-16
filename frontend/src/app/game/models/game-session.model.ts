import { User } from '../../shared/models/user.model';
import { GameMap } from './game-map.model';
import { GameEvent } from './game-event.model';

export interface GameSession {
  id: number;

  user: User;
  map: GameMap;

  startedAt: string;
  endedAt: string | null;

  status: GameSessionStatus;

  diamondStolen: boolean;
  finalScore: number | null;

  createdAt: string;
  updatedAt: string;

  gameEvents: GameEvent[];
}

export type GameSessionStatus =
  | 'RUNNING'
  | 'COMPLETED'
  | 'ABANDONED'
  | 'FAILED'
  | string;