import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'game',
    canActivate: [authGuard],
    loadChildren: () => import('./game/game.module').then(m => m.GameModule)
  }
];