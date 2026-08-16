import { Position } from './position.model';
import { GuardConfig } from './guard-config.model';

export type TileType = 'wall' | 'floor' | 'exit' | 'diamond' | 'trap';

export interface GameMap {
  id: string;
  tileSize: number;
  width: number;
  height: number;
  tiles: TileType[][];
  playerStart: Position;
  exitPosition: Position;
  diamondPosition: Position;
  guards: GuardConfig[];
}