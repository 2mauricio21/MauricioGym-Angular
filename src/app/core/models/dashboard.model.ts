export interface DashboardStats {
  totalUsuarios: number;
  usuariosAtivos: number;
  totalAcademias: number;
  academiasAtivas: number;
  totalPlanos: number;
  planosAtivos: number;
  totalPagamentos: number;
  pagamentosRecentes: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
}

export interface DashboardCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
