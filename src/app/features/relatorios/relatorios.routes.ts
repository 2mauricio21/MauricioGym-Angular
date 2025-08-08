import { Routes } from '@angular/router';

export const relatoriosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./relatorios-dashboard/relatorios-dashboard.component').then(m => m.RelatoriosDashboardComponent)
  },
  {
    path: 'financeiro',
    loadComponent: () => import('./relatorio-financeiro/relatorio-financeiro.component').then(m => m.RelatorioFinanceiroComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./relatorio-usuarios/relatorio-usuarios.component').then(m => m.RelatorioUsuariosComponent)
  },
  {
    path: 'academias',
    loadComponent: () => import('./relatorio-academias/relatorio-academias.component').then(m => m.RelatorioAcademiasComponent)
  },
  {
    path: 'acessos',
    loadComponent: () => import('./relatorio-acessos/relatorio-acessos.component').then(m => m.RelatorioAcessosComponent)
  }
];
