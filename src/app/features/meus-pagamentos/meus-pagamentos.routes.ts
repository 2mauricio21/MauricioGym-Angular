import { Routes } from '@angular/router';

export const meuspagamentosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./meus-pagamentos-list/meus-pagamentos-list.component').then(m => m.MeusPagamentosListComponent)
  },
  {
    path: 'detalhes/:id',
    loadComponent: () => import('./meus-pagamentos-detail/meus-pagamentos-detail.component').then(m => m.MeusPagamentosDetailComponent)
  }
];
