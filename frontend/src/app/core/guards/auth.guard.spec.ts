import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { routes } from '../../app.routes';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should protect the game route', () => {
    const gameRoute = routes.find(route => route.path === 'game');

    expect(gameRoute).toBeTruthy();
    expect(gameRoute?.canActivate).toContain(authGuard);
  });
});
