import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagamentos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Gerenciar Pagamentos</h1>
        <button routerLink="/pagamentos/novo" 
                class="btn-primary">
          Registrar Pagamento
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
              <option value="ano">Este Ano</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input type="text" 
                   placeholder="Buscar por usuário"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="flex items-end">
            <button class="btn-secondary">
              Filtrar
            </button>
          </div>
        </div>
      </div>

      <!-- Resumo -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-600">Total Recebido</h3>
          <p class="text-2xl font-bold text-green-600">R$ 15.450,00</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-600">Pendente</h3>
          <p class="text-2xl font-bold text-yellow-600">R$ 2.340,00</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-600">Em Atraso</h3>
          <p class="text-2xl font-bold text-red-600">R$ 890,00</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-600">Total de Pagamentos</h3>
          <p class="text-2xl font-bold text-blue-600">156</p>
        </div>
      </div>

      <!-- Lista de Pagamentos -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Vencimento</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Pagamento</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Exemplo de linha -->
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">João Silva</div>
                  <div class="text-sm text-gray-500">joao&#64;exemplo.com</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Plano Premium
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ 89,90
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  15/01/2024
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  14/01/2024
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Pago
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button routerLink="/pagamentos/1" 
                          class="btn-table-action btn-table-view mr-3">Ver</button>
                  <button routerLink="/pagamentos/1/editar" 
                          class="btn-table-action btn-table-edit mr-3">Editar</button>
                  <button class="btn-table-action btn-table-delete">Cancelar</button>
                </td>
              </tr>
              
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">Maria Santos</div>
                  <div class="text-sm text-gray-500">maria&#64;exemplo.com</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Plano Básico
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ 49,90
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  10/01/2024
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  -
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Atrasado
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button routerLink="/pagamentos/2" 
                          class="btn-table-action btn-table-view mr-3">Ver</button>
                  <button class="btn-table-action btn-table-warning mr-3">Cobrar</button>
                  <button class="btn-table-action btn-table-delete">Cancelar</button>
                </td>
              </tr>
              
              <!-- Mensagem quando não há dados -->
              <tr *ngIf="pagamentos.length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  Nenhum pagamento encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginação -->
      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Mostrando 1 a 10 de 156 resultados
        </div>
        <div class="flex space-x-2">
          <button class="btn-pagination">Anterior</button>
          <button class="btn-pagination-active">1</button>
          <button class="btn-pagination">2</button>
          <button class="btn-pagination">3</button>
          <button class="btn-pagination">Próximo</button>
        </div>
      </div>
    </div>
  `
})
export class PagamentosListComponent {
  pagamentos: any[] = [];

  constructor() {
    // Aqui você carregaria os dados dos pagamentos
  }
}
