import { Routes } from '@angular/router';

export const bloqueiosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./bloqueios-list/bloqueios-list.component').then(m => m.BloqueiosListComponent)
  },
  {
    path: 'novo',
    loadComponent: () => import('./bloqueio-form/bloqueio-form.component').then(m => m.BloqueioFormComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./bloqueio-form/bloqueio-form.component').then(m => m.BloqueioFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./bloqueio-detail/bloqueio-detail.component').then(m => m.BloqueioDetailComponent)
  }
];
