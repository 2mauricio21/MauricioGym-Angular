import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-meus-planos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Meus Planos</h1>
      
      <!-- Plano Atual -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Plano Atual</h2>
        <div class="border-l-4 border-green-500 pl-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-green-700">Plano Premium</h3>
              <p class="text-gray-600">Acesso completo a todas as funcionalidades</p>
              <p class="text-sm text-gray-500 mt-1">Válido até: 31/12/2024</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-green-600">R$ 89,90</p>
              <p class="text-sm text-gray-500">/mês</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Histórico de Planos -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Histórico de Planos</h2>
        <div class="space-y-4">
          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">Plano Básico</h3>
                <p class="text-sm text-gray-600">01/01/2024 - 30/06/2024</p>
              </div>
              <div class="text-right">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  Finalizado
                </span>
                <p class="text-sm text-gray-600 mt-1">R$ 49,90/mês</p>
              </div>
            </div>
            <button routerLink="/meus-planos/detalhes/1" 
                    class="mt-3 text-blue-600 hover:text-blue-800 text-sm">
              Ver detalhes
            </button>
          </div>

          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">Plano Premium</h3>
                <p class="text-sm text-gray-600">01/07/2024 - Atual</p>
              </div>
              <div class="text-right">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Ativo
                </span>
                <p class="text-sm text-gray-600 mt-1">R$ 89,90/mês</p>
              </div>
            </div>
            <button routerLink="/meus-planos/detalhes/2" 
                    class="mt-3 text-blue-600 hover:text-blue-800 text-sm">
              Ver detalhes
            </button>
          </div>
        </div>
      </div>

      <!-- Informações Adicionais -->
      <div class="bg-blue-50 rounded-lg p-4 mt-6">
        <h3 class="font-medium text-blue-800 mb-2">Informações Importantes</h3>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>• Seu plano é renovado automaticamente</li>
          <li>• Você pode alterar ou cancelar seu plano a qualquer momento</li>
          <li>• Para dúvidas, entre em contato com o suporte</li>
        </ul>
      </div>
    </div>
  `
})
export class MeusPlanosListComponent {

}
