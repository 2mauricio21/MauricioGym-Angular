import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Configurações do Sistema</h1>
      <div class="bg-white p-6 rounded-lg shadow">
        <p class="text-gray-600">Configurações gerais do sistema em desenvolvimento...</p>
      </div>
    </div>
  `
})
export class SystemSettingsComponent {

}
