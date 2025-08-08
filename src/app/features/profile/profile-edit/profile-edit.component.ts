import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">Editar Perfil</h1>
          <button routerLink="/profile" 
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
            Voltar
          </button>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Informações Pessoais -->
            <div class="space-y-4">
              <h2 class="text-xl font-semibold mb-4">Informações Pessoais</h2>
              
              <div>
                <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" 
                       id="nome" 
                       formControlName="nome"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Digite seu nome completo">
                <div *ngIf="profileForm.get('nome')?.invalid && profileForm.get('nome')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Nome é obrigatório
                </div>
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" 
                       id="email" 
                       formControlName="email"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Digite seu email">
                <div *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  Email válido é obrigatório
                </div>
              </div>
              
              <div>
                <label for="telefone" class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="tel" 
                       id="telefone" 
                       formControlName="telefone"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="(11) 99999-9999">
              </div>
              
              <div>
                <label for="dataNascimento" class="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                <input type="date" 
                       id="dataNascimento" 
                       formControlName="dataNascimento"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <!-- Informações Adicionais -->
            <div class="space-y-4">
              <h2 class="text-xl font-semibold mb-4">Informações Adicionais</h2>
              
              <div>
                <label for="endereco" class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <textarea id="endereco" 
                          formControlName="endereco"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Digite seu endereço completo"></textarea>
              </div>
              
              <div>
                <label for="cidade" class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input type="text" 
                       id="cidade" 
                       formControlName="cidade"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Digite sua cidade">
              </div>
              
              <div>
                <label for="cep" class="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input type="text" 
                       id="cep" 
                       formControlName="cep"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="00000-000">
              </div>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="flex flex-wrap gap-4 pt-6 border-t">
            <button type="submit" 
                    [disabled]="profileForm.invalid"
                    class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors">
              Salvar Alterações
            </button>
            <button type="button" 
                    routerLink="/profile"
                    class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProfileEditComponent {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      dataNascimento: [''],
      endereco: [''],
      cidade: [''],
      cep: ['']
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Dados do perfil:', this.profileForm.value);
      // Aqui você implementaria a lógica para salvar os dados
    }
  }
}
