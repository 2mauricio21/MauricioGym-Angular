export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserInfo;
  expiresIn: number;
}

export interface UserInfo {
  id: number;
  nome: string;
  nomeCompleto: string;
  email: string;
  tipoUsuario: string;
  statusUsuario: string;
  academias?: any[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirmRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface RegisterRequest {
  nome: string;
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmPassword: string;
  cpf: string;
  telefone: string;
  dataNascimento: Date;
  tipoUsuario: string;
  endereco?: string;
}