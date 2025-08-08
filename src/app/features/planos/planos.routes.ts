import { Routes } from '@angular/router';

export const planosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./planos-list/planos-list.component').then(m => m.PlanosListComponent)
  },
  {
    path: 'novo',
    loadComponent: () => import('./plano-form/plano-form.component').then(m => m.PlanoFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./plano-detail/plano-detail.component').then(m => m.PlanoDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./plano-form/plano-form.component').then(m => m.PlanoFormComponent)
  }
];
