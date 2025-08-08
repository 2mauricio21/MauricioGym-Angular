import { Routes } from '@angular/router';
import { NoAuthGuard } from '../../core/guards/no-auth.guard';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [NoAuthGuard],
    title: 'Login - MauricioGym'
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    canActivate: [NoAuthGuard],
    title: 'Cadastro - MauricioGym'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [NoAuthGuard],
    title: 'Esqueci a Senha - MauricioGym'
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    canActivate: [NoAuthGuard],
    title: 'Redefinir Senha - MauricioGym'
  }
];
