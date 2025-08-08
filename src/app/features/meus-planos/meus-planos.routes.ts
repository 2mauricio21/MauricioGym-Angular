import { Routes } from '@angular/router';

export const meusplanosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./meus-planos-list/meus-planos-list.component').then(m => m.MeusPlanosListComponent)
  },
  {
    path: 'detalhes/:id',
    loadComponent: () => import('./meus-planos-detail/meus-planos-detail.component').then(m => m.MeusPlanosDetailComponent)
  }
];
