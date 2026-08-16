import { GameSession } from './game-session.model';
import { GameObject } from './game-object.model';

export interface GameEvent {
  id: number;

  gameSession: GameSession;

  eventType: string;

  gameObject: GameObject | null;

  eventTime: string;

  metadata: Record<string, unknown> | null;
}