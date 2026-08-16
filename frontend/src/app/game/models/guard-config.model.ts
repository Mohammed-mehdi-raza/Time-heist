import { Position } from './position.model';

export type GuardPatrolType =
  | 'horizontal'
  | 'vertical'
  | 'custom';

export interface GuardConfig {
  id: string;
  start: Position;
  patrolType: GuardPatrolType;
  path: Position[];
}