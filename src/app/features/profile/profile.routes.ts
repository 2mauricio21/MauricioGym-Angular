import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile-view/profile-view.component').then(m => m.ProfileViewComponent)
  },
  {
    path: 'editar',
    loadComponent: () => import('./profile-edit/profile-edit.component').then(m => m.ProfileEditComponent)
  },
  {
    path: 'alterar-senha',
    loadComponent: () => import('./change-password/change-password.component').then(m => m.ChangePasswordComponent)
  }
];