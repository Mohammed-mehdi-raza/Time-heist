import { Position } from './position.model';
export interface GuardState {

  id: string;
  position: Position;
  // patrolPoints: Position[];
  currentPatrolIndex: number;
  visionRange: number;
  isAlerted: boolean;

  type: 'guard1' | 'guard2' | 'guard3';

  x: number;
  y: number;

  speed: number;

  patrolPoints: {
    x: number;
    y: number;
  }[];

  currentPatrolPoint: number;

  animation:
    | 'idle'
    | 'walking'
    | 'attacking'
    | 'hurt'
    | 'dying';

  alive: boolean;
}
