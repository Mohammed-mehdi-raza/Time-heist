import { Position } from './position.model';

export interface Guard {
  id: string;
  position: Position;
  patrolPoints: Position[];
  currentPatrolIndex: number;
  visionRange: number;
  isAlerted: boolean;
}