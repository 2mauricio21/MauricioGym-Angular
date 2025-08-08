export interface Plano {
  idPlano: number;
  nomePlano: string;
  descricaoPlano: string;
  valorMensal: number;
  duracaoMeses: number;
  beneficios: string;
  limitePessoas?: number;
  statusPlano: StatusPlano;
  dataCadastro: Date;
  dataUltimaAtualizacao?: Date;
}

export enum StatusPlano {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
  Promocional = 'Promocional'
}

export interface CreatePlanoRequest {
  nomePlano: string;
  descricaoPlano: string;
  valorMensal: number;
  duracaoMeses: number;
  beneficios: string;
  limitePessoas?: number;
}

export interface UpdatePlanoRequest extends CreatePlanoRequest {
  idPlano: number;
  statusPlano: StatusPlano;
}

export interface UsuarioPlano {
  idUsuarioPlano: number;
  idUsuario: number;
  idPlano: number;
  dataInicio: Date;
  dataFim: Date;
  statusPlano: StatusUsuarioPlano;
  valorPago: number;
  observacoes?: string;
  usuario?: any;
  plano?: Plano;
}

export enum StatusUsuarioPlano {
  Ativo = 'Ativo',
  Vencido = 'Vencido',
  Cancelado = 'Cancelado',
  Suspenso = 'Suspenso'
}
