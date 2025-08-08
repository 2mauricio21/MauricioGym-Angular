import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorio-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Relatório de Usuários</h1>
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2">Estatísticas de Usuários</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-blue-50 p-4 rounded">
              <p class="text-sm text-gray-600">Total de Usuários</p>
              <p class="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div class="bg-green-50 p-4 rounded">
              <p class="text-sm text-gray-600">Usuários Ativos</p>
              <p class="text-2xl font-bold text-green-600">0</p>
            </div>
            <div class="bg-yellow-50 p-4 rounded">
              <p class="text-sm text-gray-600">Novos Este Mês</p>
              <p class="text-2xl font-bold text-yellow-600">0</p>
            </div>
            <div class="bg-purple-50 p-4 rounded">
              <p class="text-sm text-gray-600">Planos Ativos</p>
              <p class="text-2xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </div>
        <p class="text-gray-600">Relatório detalhado de usuários em desenvolvimento...</p>
      </div>
    </div>
  `
})
export class RelatorioUsuariosComponent {

}
