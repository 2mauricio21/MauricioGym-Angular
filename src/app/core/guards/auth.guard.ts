import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Se há token, validar automaticamente no backend
    if (this.authService.token) {
      return this.authService.validateToken().pipe(
        switchMap(isValid => {
          if (isValid) {
            return of(true);
          } else {
            // Token inválido, tentar refresh
            return this.authService.refreshToken().pipe(
              map(() => true),
              catchError(() => {
                this.authService.logout();
                this.router.navigate(['/auth/login'], {
                  queryParams: { returnUrl: state.url }
                });
                return of(false);
              })
            );
          }
        }),
        catchError(() => {
          this.authService.logout();
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
          return of(false);
        })
      );
    }
    
    // Sem token, verificar estado de autenticação
    return this.authService.isAuthenticated$
      .pipe(
        take(1),
        map(isAuthenticated => {
          if (isAuthenticated) {
            return true;
          } else {
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: state.url }
            });
            return false;
          }
        })
      );
  }
}
