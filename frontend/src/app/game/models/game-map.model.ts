export interface GameMap {
  id: number;
  name: string;
  description: string | null;
  width: number;
  height: number;
  startX: number;
  startY: number;
  escapeX: number;
  escapeY: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}