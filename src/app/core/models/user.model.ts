export interface UserInfo {
  id: number;
  nome: string;
  nomeCompleto?: string;
  email: string;
  tipo: TipoUsuario;
  tipoUsuario?: TipoUsuario; // Alias para compatibilidade
  status: StatusUsuario;
  dataCriacao: string;
  dataUltimoAcesso?: string;
  foto?: string;
}

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  tipo: TipoUsuario;
  status: StatusUsuario;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: Endereco;
  foto?: string;
  dataCriacao?: string;
  dataUltimoAcesso?: string;
  academiaId?: number;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export enum TipoUsuario {
  Administrador = 'Administrador',
  Funcionario = 'Funcionario',
  Cliente = 'Cliente'
}

export enum StatusUsuario {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
  Pendente = 'Pendente',
  Bloqueado = 'Bloqueado'
}

export interface UsuarioFilter {
  nome?: string;
  email?: string;
  tipo?: TipoUsuario;
  status?: StatusUsuario;
  academiaId?: number;
}

export interface UsuarioStats {
  total: number;
  ativos: number;
  inativos: number;
  pendentes: number;
  bloqueados: number;
  porTipo: {
    administradores: number;
    funcionarios: number;
    clientes: number;
  };
}
