import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relatorios-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-8">Dashboard de Relatórios</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Relatório Financeiro -->
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer" 
             routerLink="/relatorios/financeiro">
          <div class="flex items-center mb-4">
            <div class="bg-green-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-2">Relatório Financeiro</h3>
          <p class="text-gray-600 mb-4">Visualize receitas, despesas e análises financeiras</p>
          <div class="text-sm text-green-600 font-medium">Ver relatório →</div>
        </div>

        <!-- Relatório de Usuários -->
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer" 
             routerLink="/relatorios/usuarios">
          <div class="flex items-center mb-4">
            <div class="bg-blue-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-2">Relatório de Usuários</h3>
          <p class="text-gray-600 mb-4">Estatísticas e dados dos usuários cadastrados</p>
          <div class="text-sm text-blue-600 font-medium">Ver relatório →</div>
        </div>

        <!-- Relatório de Academias -->
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer" 
             routerLink="/relatorios/academias">
          <div class="flex items-center mb-4">
            <div class="bg-purple-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-2">Relatório de Academias</h3>
          <p class="text-gray-600 mb-4">Informações e estatísticas das academias</p>
          <div class="text-sm text-purple-600 font-medium">Ver relatório →</div>
        </div>

        <!-- Relatório de Acessos -->
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer" 
             routerLink="/relatorios/acessos">
          <div class="flex items-center mb-4">
            <div class="bg-orange-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-2">Relatório de Acessos</h3>
          <p class="text-gray-600 mb-4">Controle e monitoramento de acessos</p>
          <div class="text-sm text-orange-600 font-medium">Ver relatório →</div>
        </div>
      </div>

      <!-- Resumo Geral -->
      <div class="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4">Resumo Geral</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">R$ 0,00</div>
            <div class="text-sm text-gray-600">Receita Total</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">0</div>
            <div class="text-sm text-gray-600">Usuários Ativos</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600">0</div>
            <div class="text-sm text-gray-600">Academias</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600">0</div>
            <div class="text-sm text-gray-600">Acessos Hoje</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RelatoriosDashboardComponent {

}
