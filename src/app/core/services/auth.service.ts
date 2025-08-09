import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  UserInfo,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  ResetPasswordRequest,
  ResetPasswordConfirmRequest,
  RegisterRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  
  private readonly apiUrl = environment.apiUrls.auth;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  get currentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(environment.auth.tokenKey);
    const userStr = localStorage.getItem('mauriciogym_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<any>(`${this.apiUrl}${environment.auth.loginEndpoint}`, credentials)
      .pipe(
        tap(response => {
          if (response.token && (response.user || response.usuario)) {
            // A API retorna 'usuario' mas o frontend espera 'user'
            const user = response.user || response.usuario;
            this.setAuthData(response.token, user);
            if (response.refreshToken) {
              localStorage.setItem(environment.auth.refreshTokenKey, response.refreshToken);
            }
          }
        }),
        catchError(error => {
          console.error('Erro no login:', error);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(error => {
          console.error('Erro no registro:', error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem(environment.auth.refreshTokenKey);
    
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token não encontrado'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    
    return this.http
      .post<RefreshTokenResponse>(`${this.apiUrl}${environment.auth.refreshEndpoint}`, request)
      .pipe(
        tap(response => {
          if (response.token) {
            const currentUser = this.getCurrentUser();
            if (currentUser) {
              this.setAuthData(response.token, currentUser);
            }
            if (response.refreshToken) {
              localStorage.setItem(environment.auth.refreshTokenKey, response.refreshToken);
            }
          }
        }),
        catchError(error => {
          console.error('Erro ao renovar token:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/change-password`, request)
      .pipe(
        catchError(error => {
          console.error('Erro ao alterar senha:', error);
          return throwError(() => error);
        })
      );
  }

  resetPassword(request: ResetPasswordRequest): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/reset-password`, request)
      .pipe(
        catchError(error => {
          console.error('Erro ao resetar senha:', error);
          return throwError(() => error);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/forgot-password`, { email })
      .pipe(
        catchError(error => {
          console.error('Erro ao solicitar recuperação de senha:', error);
          return throwError(() => error);
        })
      );
  }

  resetPasswordConfirm(request: ResetPasswordConfirmRequest): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/reset-password-confirm`, request)
      .pipe(
        catchError(error => {
          console.error('Erro ao confirmar redefinição de senha:', error);
          return throwError(() => error);
        })
      );
  }

  validateToken(): Observable<boolean> {
    const token = this.token;
    
    if (!token) {
      return of(false);
    }

    return this.http
      .get<any>(`${this.apiUrl}/validate`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            return true;
          }
          return false;
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  logout(): void {
    // Limpar dados do localStorage
    localStorage.removeItem(environment.auth.tokenKey);
    localStorage.removeItem('mauriciogym_user');
    localStorage.removeItem(environment.auth.refreshTokenKey);
    
    // Limpar subjects
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    
    // Redirecionar para login
    this.router.navigate(['/auth/login']);
  }

  signOut(): void {
    this.logout();
  }

  private setAuthData(token: string, user: UserInfo): void {
    // Salvar no localStorage
    localStorage.setItem(environment.auth.tokenKey, token);
    localStorage.setItem('mauriciogym_user', JSON.stringify(user));
    
    // Atualizar subjects
    this.tokenSubject.next(token);
    this.currentUserSubject.next(user);
  }

  updateUserProfile(userData: Partial<UserInfo>): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/profile`, userData)
      .pipe(
        tap(response => {
          if (response && this.currentUser) {
            const updatedUser = { ...this.currentUser, ...userData };
            this.currentUserSubject.next(updatedUser);
            localStorage.setItem('mauriciogym_user', JSON.stringify(updatedUser));
          }
        }),
        catchError(error => {
          console.error('Erro ao atualizar perfil:', error);
          return throwError(() => error);
        })
      );
  }

  checkPermission(requiredRole: string): boolean {
    const user = this.currentUser;
    if (!user) return false;
    
    // Implementar lógica de verificação de permissões
    // Por exemplo, verificar se o usuário tem o papel necessário
    return user.tipoUsuario === requiredRole;
  }

  hasRole(role: string): boolean {
    return this.checkPermission(role);
  }

  initializeAuth(): void {
    this.validateToken().subscribe({
      next: (isValid) => {
        if (!isValid) {
          this.logout();
        }
      },
      error: () => {
        this.logout();
      }
    });
  }
}
