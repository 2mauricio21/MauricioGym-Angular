export interface Pagamento {
  idPagamento: number;
  idUsuario: number;
  idPlano: number;
  valorPagamento: number;
  dataPagamento: Date;
  dataVencimento: Date;
  metodoPagamento: MetodoPagamento;
  statusPagamento: StatusPagamento;
  numeroTransacao?: string;
  observacoes?: string;
  dataCadastro: Date;
  usuario?: any;
  plano?: any;
}

export enum MetodoPagamento {
  Dinheiro = 'Dinheiro',
  CartaoCredito = 'CartaoCredito',
  CartaoDebito = 'CartaoDebito',
  Pix = 'Pix',
  Transferencia = 'Transferencia',
  Boleto = 'Boleto'
}

export enum StatusPagamento {
  Pendente = 'Pendente',
  Pago = 'Pago',
  Vencido = 'Vencido',
  Cancelado = 'Cancelado',
  Estornado = 'Estornado'
}

export interface CreatePagamentoRequest {
  idUsuario: number;
  idPlano: number;
  valorPagamento: number;
  dataVencimento: Date;
  metodoPagamento: MetodoPagamento;
  numeroTransacao?: string;
  observacoes?: string;
}

export interface UpdatePagamentoRequest {
  idPagamento: number;
  statusPagamento: StatusPagamento;
  dataPagamento?: Date;
  numeroTransacao?: string;
  observacoes?: string;
}

export interface PagamentoResumo {
  totalPagamentos: number;
  valorTotal: number;
  pagamentosPendentes: number;
  valorPendente: number;
  pagamentosVencidos: number;
  valorVencido: number;
}
