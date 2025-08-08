import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./settings-dashboard/settings-dashboard.component').then(m => m.SettingsDashboardComponent)
  },
  {
    path: 'sistema',
    loadComponent: () => import('./system-settings/system-settings.component').then(m => m.SystemSettingsComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./user-settings/user-settings.component').then(m => m.UserSettingsComponent)
  },
  {
    path: 'academias',
    loadComponent: () => import('./academia-settings/academia-settings.component').then(m => m.AcademiaSettingsComponent)
  },
  {
    path: 'backup',
    loadComponent: () => import('./backup-settings/backup-settings.component').then(m => m.BackupSettingsComponent)
  }
];
