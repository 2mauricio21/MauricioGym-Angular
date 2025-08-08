export * from './usuario.model';
export * from './academia.model';
export * from './plano.model';
export * from './pagamento.model';
export * from './acesso.model';
export * from './api-response.model';
export * from './auth.model';
export * from './dashboard.model';

// Interfaces comuns

export interface DashboardStats {
  totalUsuarios: number;
  usuariosAtivos: number;
  totalAcademias: number;
  academiasAtivas: number;
  totalPlanos: number;
  planosAtivos: number;
  totalPagamentos: number;
  pagamentosRecentes: number;
  acessosHoje: number;
  pagamentosVencidos: number;
  receitaMensal: number;
}
