import { Position } from './position.model';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Player {
  id: string;
  position: Position;
  direction: Direction;
  speed: number;
  health: number;
  hasDiamond: boolean;
}