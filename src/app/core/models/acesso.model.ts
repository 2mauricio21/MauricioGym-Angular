export interface Acesso {
  idAcesso: number;
  idUsuario: number;
  idAcademia: number;
  dataHoraEntrada: Date;
  dataHoraSaida?: Date;
  tipoAcesso: TipoAcesso;
  observacaoAcesso?: string;
  acessoLiberado: boolean;
  motivoNegacao?: string;
  usuario?: any;
  academia?: any;
}

export enum TipoAcesso {
  Normal = 'Normal',
  Visitante = 'Visitante',
  Funcionario = 'Funcionario',
  Manutencao = 'Manutencao'
}

export interface CreateAcessoRequest {
  idUsuario: number;
  idAcademia: number;
  tipoAcesso: TipoAcesso;
  observacaoAcesso?: string;
}

export interface UpdateAcessoRequest {
  idAcesso: number;
  dataHoraSaida?: Date;
  observacaoAcesso?: string;
}

export interface BloqueioAcesso {
  idBloqueio: number;
  idUsuario: number;
  idAcademia: number;
  motivoBloqueio: string;
  dataBloqueio: Date;
  dataDesbloqueio?: Date;
  statusBloqueio: StatusBloqueio;
  observacoes?: string;
  usuario?: any;
  academia?: any;
}

export enum StatusBloqueio {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
  Temporario = 'Temporario'
}

export interface AcessoResumo {
  totalAcessos: number;
  acessosHoje: number;
  acessosAtivos: number;
  usuariosUnicos: number;
  tempoMedioSessao: number;
}

export interface RelatorioAcesso {
  data: Date;
  totalAcessos: number;
  acessosLiberados: number;
  acessosNegados: number;
  usuariosUnicos: number;
}
