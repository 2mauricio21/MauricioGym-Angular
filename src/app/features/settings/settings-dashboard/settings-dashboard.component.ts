import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Configurações do Sistema</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Configurações Gerais</h3>
          <p class="text-gray-600">Configurações básicas do sistema</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Usuários</h3>
          <p class="text-gray-600">Gerenciar configurações de usuários</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Academias</h3>
          <p class="text-gray-600">Configurações das academias</p>
        </div>
      </div>
    </div>
  `
})
export class SettingsDashboardComponent {

}
