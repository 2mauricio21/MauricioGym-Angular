// Request Entities - seguindo padrão do backend
export interface LoginRequestEntity {
  email: string;
  senha: string;
}

export interface ValidateTokenRequestEntity {
  token: string;
}

export interface RefreshTokenRequestEntity {
  refreshToken: string;
}

export interface AlterarSenhaRequestEntity {
  idUsuario: number;
  senhaAtual: string;
  novaSenha: string;
}

// Response Entities - seguindo padrão do backend
export interface LoginResponseEntity {
  token: string;
  refreshToken: string;
  dataExpiracao: Date;
  usuario: UsuarioResponseEntity;
}

export interface ValidateTokenResponseEntity {
  valido: boolean;
  usuario?: UsuarioResponseEntity;
  mensagem?: string;
}

export interface RefreshTokenResponseEntity {
  token: string;
  refreshToken: string;
  dataExpiracao: Date;
}

// Importar UsuarioResponseEntity do usuario.model para evitar duplicação
import { UsuarioResponseEntity } from './usuario.model';

// Interfaces de compatibilidade (mantidas para não quebrar código existente)
export interface LoginRequest extends LoginRequestEntity {}
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

export interface RefreshTokenRequest extends RefreshTokenRequestEntity {}
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