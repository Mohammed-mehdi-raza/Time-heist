import { Position } from './position.model';

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
}