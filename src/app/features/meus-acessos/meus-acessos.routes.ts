import { Routes } from '@angular/router';

export const meusacessosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./meus-acessos-list/meus-acessos-list.component').then(m => m.MeusAcessosListComponent)
  },
  {
    path: 'detalhes/:id',
    loadComponent: () => import('./meus-acessos-detail/meus-acessos-detail.component').then(m => m.MeusAcessosDetailComponent)
  }
];
