import { GameMap } from './game-map.model';

export interface GameObject {
  id: number;

  map: GameMap;

  objectType: string;

  positionX: number;
  positionY: number;

  configuration: Record<string, unknown> | null;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}