import { Routes } from '@angular/router';

export const pagamentosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pagamentos-list/pagamentos-list.component').then(m => m.PagamentosListComponent)
  },
  {
    path: 'novo',
    loadComponent: () => import('./pagamento-form/pagamento-form.component').then(m => m.PagamentoFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pagamento-detail/pagamento-detail.component').then(m => m.PagamentoDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./pagamento-form/pagamento-form.component').then(m => m.PagamentoFormComponent)
  }
];
