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
  RegisterRequest,
  LoginRequestEntity,
  LoginResponseEntity,
  ValidateTokenRequestEntity,
  ValidateTokenResponseEntity,
  RefreshTokenRequestEntity,
  RefreshTokenResponseEntity,
  AlterarSenhaRequestEntity,
  UsuarioResponseEntity
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  
  private readonly apiUrl = environment.apiUrls.seguranca;

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
    const loginRequest: LoginRequestEntity = {
      email: credentials.email,
      senha: credentials.senha
    };

    return this.http
      .post<any>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        map(response => {
          // Verificar se a resposta contém dados válidos
          if (response && response.retorno) {
            const loginResponse: LoginResponseEntity = response.retorno;
            
            // Converter para formato esperado pelo frontend
            const userInfo: UserInfo = {
              id: loginResponse.usuario.idUsuario,
              nome: loginResponse.usuario.nome,
              nomeCompleto: loginResponse.usuario.nomeCompleto || `${loginResponse.usuario.nome} ${loginResponse.usuario.sobrenome}`,
              email: loginResponse.usuario.email,
              tipoUsuario: loginResponse.usuario.tipoUsuario || 'Cliente',
              statusUsuario: loginResponse.usuario.ativo ? 'Ativo' : 'Inativo'
            };

            const compatibleResponse: LoginResponse = {
              token: loginResponse.token,
              refreshToken: loginResponse.refreshToken,
              user: userInfo,
              expiresIn: new Date(loginResponse.dataExpiracao).getTime() - Date.now()
            };

            // Salvar dados de autenticação
            this.setAuthData(loginResponse.token, userInfo);
            if (loginResponse.refreshToken) {
              localStorage.setItem(environment.auth.refreshTokenKey, loginResponse.refreshToken);
            }

            return compatibleResponse;
          } else {
            throw new Error('Resposta inválida do servidor');
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

    const request: RefreshTokenRequestEntity = { refreshToken };
    
    return this.http
      .post<any>(`${this.apiUrl}/refresh-token`, request)
      .pipe(
        map(response => {
          if (response && response.retorno) {
            const refreshResponse: RefreshTokenResponseEntity = response.retorno;
            
            const currentUser = this.getCurrentUser();
            if (currentUser) {
              this.setAuthData(refreshResponse.token, currentUser);
            }
            if (refreshResponse.refreshToken) {
              localStorage.setItem(environment.auth.refreshTokenKey, refreshResponse.refreshToken);
            }

            const compatibleResponse: RefreshTokenResponse = {
              token: refreshResponse.token,
              refreshToken: refreshResponse.refreshToken,
              expiresIn: new Date(refreshResponse.dataExpiracao).getTime() - Date.now()
            };

            return compatibleResponse;
          } else {
            throw new Error('Resposta inválida do servidor');
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
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const alterarSenhaRequest: AlterarSenhaRequestEntity = {
      idUsuario: currentUser.id,
      senhaAtual: request.currentPassword,
      novaSenha: request.newPassword
    };

    return this.http
      .post(`${this.apiUrl}/alterar-senha`, alterarSenhaRequest)
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

    const request: ValidateTokenRequestEntity = { token };

    return this.http
      .post<any>(`${this.apiUrl}/validar-token`, request)
      .pipe(
        map(response => {
          if (response && response.retorno) {
            const validateResponse: ValidateTokenResponseEntity = response.retorno;
            
            if (validateResponse.valido && validateResponse.usuario) {
              // Converter para formato esperado pelo frontend
              const userInfo: UserInfo = {
                id: validateResponse.usuario.idUsuario,
                nome: validateResponse.usuario.nome,
                nomeCompleto: validateResponse.usuario.nomeCompleto || `${validateResponse.usuario.nome} ${validateResponse.usuario.sobrenome}`,
                email: validateResponse.usuario.email,
                tipoUsuario: validateResponse.usuario.tipoUsuario || 'Cliente',
                statusUsuario: validateResponse.usuario.ativo ? 'Ativo' : 'Inativo'
              };
              
              // Atualizar dados do usuário com informações atualizadas do backend
              this.currentUserSubject.next(userInfo);
              localStorage.setItem('mauriciogym_user', JSON.stringify(userInfo));
              return true;
            }
          }
          return false;
        }),
        catchError((error) => {
          console.log('Token inválido ou expirado:', error);
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
    // Carregar dados salvos do localStorage
    const savedToken = localStorage.getItem(environment.auth.tokenKey);
    const savedUser = localStorage.getItem('mauriciogym_user');
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.tokenSubject.next(savedToken);
        this.currentUserSubject.next(user);
        
        // Validar token no backend
        this.validateToken().subscribe({
          next: (isValid) => {
            if (!isValid) {
              console.log('Token inválido, fazendo logout...');
              this.logout();
            } else {
              console.log('Login automático realizado com sucesso');
            }
          },
          error: () => {
            console.log('Erro na validação do token, fazendo logout...');
            this.logout();
          }
        });
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
        this.logout();
      }
    }
  }

  // Método para verificar se o token está próximo do vencimento
  isTokenExpiringSoon(): boolean {
    const token = this.token;
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Converter para milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;
      
      // Retorna true se o token expira em menos de 5 minutos (300000 ms)
      return timeUntilExpiration < 300000;
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error);
      return true;
    }
  }

  // Método para renovar token automaticamente se necessário
  autoRefreshToken(): void {
    if (this.isTokenExpiringSoon()) {
      this.refreshToken().subscribe({
        next: () => {
          console.log('Token renovado automaticamente');
        },
        error: (error) => {
          console.error('Erro ao renovar token automaticamente:', error);
          this.logout();
        }
      });
    }
  }
}
