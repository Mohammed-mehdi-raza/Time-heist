import { User } from './user.model';

export interface PlayerProfile {
  id: number;

  user: User;

  displayName: string | null;
  avatar: string | null;

  createdAt: string;
  updatedAt: string;
}