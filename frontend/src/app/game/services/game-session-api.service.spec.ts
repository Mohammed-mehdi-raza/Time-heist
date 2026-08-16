import { TestBed } from '@angular/core/testing';

import { GameSessionApiService } from './game-session-api.service';

describe('GameSessionApiService', () => {
  let service: GameSessionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSessionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
