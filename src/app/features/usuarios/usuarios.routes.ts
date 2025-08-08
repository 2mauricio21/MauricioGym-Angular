import { Routes } from '@angular/router';

export const usuariosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./usuarios-list/usuarios-list.component').then(m => m.UsuariosListComponent)
  },
  {
    path: 'novo',
    loadComponent: () => import('./usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./usuario-detail/usuario-detail.component').then(m => m.UsuarioDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent)
  }
];
