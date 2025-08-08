import { Routes } from '@angular/router';

export const acessosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./acessos-list/acessos-list.component').then(m => m.AcessosListComponent)
  },
  {
    path: 'novo',
    loadComponent: () => import('./acesso-form/acesso-form.component').then(m => m.AcessoFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./acesso-detail/acesso-detail.component').then(m => m.AcessoDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./acesso-form/acesso-form.component').then(m => m.AcessoFormComponent)
  }
];
