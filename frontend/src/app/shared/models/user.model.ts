import { PlayerProfile } from './player-profile.model';

export interface User {
  id: number;
  username: string;
  email: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  playerProfile: PlayerProfile | null;
}

export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'BLOCKED'
  | 'SUSPENDED'
  | string;