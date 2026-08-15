import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule)
  }
];