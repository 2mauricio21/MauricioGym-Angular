import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  // Redirect root to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Auth routes (without layout)
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Main application routes (with layout)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
      },

      // Usuarios
      {
        path: 'usuarios',
        loadChildren: () => import('./features/usuarios/usuarios.routes').then(m => m.usuariosRoutes)
      },

      // Academias
      {
        path: 'academias',
        loadChildren: () => import('./features/academias/academias.routes').then(m => m.academiasRoutes)
      },

      // Planos
      {
        path: 'planos',
        loadChildren: () => import('./features/planos/planos.routes').then(m => m.planosRoutes)
      },
      {
        path: 'meus-planos',
        loadChildren: () => import('./features/meus-planos/meus-planos.routes').then(m => m.meusplanosRoutes)
      },

      // Pagamentos
      {
        path: 'pagamentos',
        loadChildren: () => import('./features/pagamentos/pagamentos.routes').then(m => m.pagamentosRoutes)
      },
      {
        path: 'meus-pagamentos',
        loadChildren: () => import('./features/meus-pagamentos/meus-pagamentos.routes').then(m => m.meuspagamentosRoutes)
      },

      // Acessos
      {
        path: 'acessos',
        loadChildren: () => import('./features/acessos/acessos.routes').then(m => m.acessosRoutes)
      },
      {
        path: 'meus-acessos',
        loadChildren: () => import('./features/meus-acessos/meus-acessos.routes').then(m => m.meusacessosRoutes)
      },

      // Bloqueios
      {
        path: 'bloqueios',
        loadChildren: () => import('./features/bloqueios/bloqueios.routes').then(m => m.bloqueiosRoutes)
      },

      // Relatórios
      {
        path: 'relatorios',
        loadChildren: () => import('./features/relatorios/relatorios.routes').then(m => m.relatoriosRoutes)
      },

      // Profile
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.profileRoutes)
      },

      // Settings
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes)
      }
    ]
  },

  // Error pages
  {
    path: '404',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '403',
    loadComponent: () => import('./shared/components/forbidden/forbidden.component').then(m => m.ForbiddenComponent)
  },
  {
    path: '500',
    loadComponent: () => import('./shared/components/server-error/server-error.component').then(m => m.ServerErrorComponent)
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/404'
  }
];
