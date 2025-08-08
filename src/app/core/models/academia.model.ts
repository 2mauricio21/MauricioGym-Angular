import { Usuario } from './user.model';

export interface Academia {
  idAcademia: number;
  nomeAcademia: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  horarioFuncionamento: string;
  capacidadeMaxima: number;
  statusAcademia: StatusAcademia;
  dataCadastro: Date;
  dataUltimaAtualizacao?: Date;
  observacoes?: string;
}

export enum StatusAcademia {
  Ativa = 'Ativa',
  Inativa = 'Inativa',
  Manutencao = 'Manutencao'
}

export interface CreateAcademiaRequest {
  nomeAcademia: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  horarioFuncionamento: string;
  capacidadeMaxima: number;
  observacoes?: string;
}

export interface UpdateAcademiaRequest extends CreateAcademiaRequest {
  idAcademia: number;
  statusAcademia: StatusAcademia;
}

export interface UsuarioAcademia {
  idUsuarioAcademia: number;
  idUsuario: number;
  idAcademia: number;
  dataAssociacao: Date;
  statusAssociacao: StatusAssociacao;
  observacoes?: string;
  usuario?: Usuario;
  academia?: Academia;
}

export enum StatusAssociacao {
  Ativa = 'Ativa',
  Inativa = 'Inativa',
  Suspensa = 'Suspensa'
}
