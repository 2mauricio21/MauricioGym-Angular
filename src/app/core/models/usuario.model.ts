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

export interface CreateUsuarioRequest {
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
  observacoes?: string;
}

export interface UpdateUsuarioRequest {
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
  observacoes?: string;
}
