import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggedUserPagesGuard } from './logged-user-pages.guard';

describe('loggedInUserPagesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => loggedUserPagesGuard(...guardParameters));// eslint-disable-line max-len

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
