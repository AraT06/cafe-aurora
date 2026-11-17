import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.listo).pipe(
    filter((listo) => listo),
    take(1),
    map(() =>
      authService.autenticado() ? true : router.createUrlTree(['/login'], { queryParams: { redirect: state.url } })
    )
  );
};
