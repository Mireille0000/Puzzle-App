import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loggedUserPagesGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (localStorage.getItem('userCredentials')) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
