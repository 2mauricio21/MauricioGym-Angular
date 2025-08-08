import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">Meu Perfil</h1>
          <button routerLink="/profile/editar" 
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Editar Perfil
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Informações Pessoais -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold mb-4">Informações Pessoais</h2>
            
            <div class="border-b pb-3">
              <label class="text-sm font-medium text-gray-600">Nome Completo</label>
              <p class="text-lg">Usuário Exemplo</p>
            </div>
            
            <div class="border-b pb-3">
              <label class="text-sm font-medium text-gray-600">Email</label>
              <p class="text-lg">usuario&#64;exemplo.com</p>
            </div>
            
            <div class="border-b pb-3">
              <label class="text-sm font-medium text-gray-600">Telefone</label>
              <p class="text-lg">(11) 99999-9999</p>
            </div>
            
            <div class="border-b pb-3">
              <label class="text-sm font-medium text-gray-600">Data de Nascimento</label>
              <p class="text-lg">01/01/1990</p>
            </div>
          </div>

          <!-- Informações da Academia -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold mb-4">Informações da Academia</h2>
            
            <div class="border-b pb-3">
              <label class="text-sm font-medium text-gray-600">Academia</label>
              <p class="text-lg">Academia Exemplo</p>
            </div>
            
            <div class="border-b pb-3">
              <label class="text-sm font-medium text-gray-600">Plano Atual</label>
              <p class="text-lg">Plano Premium</p>
            </div>
            
            <div class="border-b pb-3">
              <label class="text-sm font-medium text-gray-600">Status</label>
              <span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Ativo</span>
            </div>
            
            <div class="border-b pb-3">
              <label class="text-sm font-medium text-gray-600">Data de Vencimento</label>
              <p class="text-lg">31/12/2024</p>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div class="mt-8 flex flex-wrap gap-4">
          <button routerLink="/profile/editar" 
                  class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Editar Perfil
          </button>
          <button routerLink="/profile/alterar-senha" 
                  class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProfileViewComponent {

}
