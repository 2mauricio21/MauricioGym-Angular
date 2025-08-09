export interface Usuario {
  idUsuario: number;
  nome: string;
  sobrenome: string;
  email: string;
  senha?: string;
  cpf: string;
  telefone: string;
  dataNascimento?: Date;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
  dataCadastro: Date;
  dataUltimoLogin?: Date;
  // Propriedades derivadas para compatibilidade
  nomeCompleto?: string;
  tipoUsuario?: TipoUsuario;
  statusUsuario?: StatusUsuario;
  dataUltimaAtualizacao?: Date;
  observacoes?: string;
}

export enum TipoUsuario {
  Administrador = 'Administrador',
  Funcionario = 'Funcionario',
  Cliente = 'Cliente'
}

export enum StatusUsuario {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
  Suspenso = 'Suspenso'
}

// Request Entities - seguindo padrão do backend
export interface IncluirUsuarioRequestEntity {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  dataNascimento?: Date;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo?: boolean;
}

export interface AlterarUsuarioRequestEntity {
  idUsuario: number;
  nome: string;
  sobrenome: string;
  email: string;
  senha?: string;
  cpf: string;
  telefone: string;
  dataNascimento?: Date;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
}

export interface ConsultarUsuarioRequestEntity {
  idUsuario: number;
}

export interface ExcluirUsuarioRequestEntity {
  idUsuario: number;
}

// Response Entities - seguindo padrão do backend
export interface UsuarioResponseEntity {
  idUsuario: number;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento?: Date;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
  dataCadastro: Date;
  dataUltimoLogin?: Date;
  nomeCompleto?: string;
  tipoUsuario?: TipoUsuario;
  statusUsuario?: StatusUsuario;
}

// Interfaces de compatibilidade (manter para não quebrar código existente)
export interface CreateUsuarioRequest extends IncluirUsuarioRequestEntity {
  observacoes?: string;
}

export interface UpdateUsuarioRequest extends AlterarUsuarioRequestEntity {
  observacoes?: string;
}
