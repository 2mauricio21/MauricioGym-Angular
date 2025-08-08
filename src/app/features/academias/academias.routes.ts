import { Routes } from '@angular/router';
import { AcademiasListComponent } from './academias-list/academias-list.component';
import { AcademiaFormComponent } from './academia-form/academia-form.component';
import { AcademiaDetailComponent } from './academia-detail/academia-detail.component';

export const academiasRoutes: Routes = [
  {
    path: '',
    component: AcademiasListComponent,
    title: 'Academias'
  },
  {
    path: 'nova',
    component: AcademiaFormComponent,
    title: 'Nova Academia'
  },
  {
    path: ':id',
    component: AcademiaDetailComponent,
    title: 'Detalhes da Academia'
  },
  {
    path: ':id/editar',
    component: AcademiaFormComponent,
    title: 'Editar Academia'
  }
];
