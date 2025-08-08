import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">Alterar Senha</h1>
          <button routerLink="/profile" 
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
            Voltar
          </button>
        </div>

        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="senhaAtual" class="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
            <input type="password" 
                   id="senhaAtual" 
                   formControlName="senhaAtual"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Digite sua senha atual">
            <div *ngIf="passwordForm.get('senhaAtual')?.invalid && passwordForm.get('senhaAtual')?.touched" 
                 class="text-red-500 text-sm mt-1">
              Senha atual é obrigatória
            </div>
          </div>
          
          <div>
            <label for="novaSenha" class="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
            <input type="password" 
                   id="novaSenha" 
                   formControlName="novaSenha"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Digite sua nova senha">
            <div *ngIf="passwordForm.get('novaSenha')?.invalid && passwordForm.get('novaSenha')?.touched" 
                 class="text-red-500 text-sm mt-1">
              <div *ngIf="passwordForm.get('novaSenha')?.errors?.['required']">Nova senha é obrigatória</div>
              <div *ngIf="passwordForm.get('novaSenha')?.errors?.['minlength']">A senha deve ter pelo menos 6 caracteres</div>
            </div>
          </div>
          
          <div>
            <label for="confirmarSenha" class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
            <input type="password" 
                   id="confirmarSenha" 
                   formControlName="confirmarSenha"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Confirme sua nova senha">
            <div *ngIf="passwordForm.get('confirmarSenha')?.invalid && passwordForm.get('confirmarSenha')?.touched" 
                 class="text-red-500 text-sm mt-1">
              <div *ngIf="passwordForm.get('confirmarSenha')?.errors?.['required']">Confirmação de senha é obrigatória</div>
              <div *ngIf="passwordForm.errors?.['passwordMismatch']">As senhas não coincidem</div>
            </div>
          </div>

          <!-- Dicas de Segurança -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Dicas para uma senha segura:</h3>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Use pelo menos 8 caracteres</li>
              <li>• Combine letras maiúsculas e minúsculas</li>
              <li>• Inclua números e símbolos</li>
              <li>• Evite informações pessoais</li>
            </ul>
          </div>

          <!-- Botões de Ação -->
          <div class="flex flex-wrap gap-4 pt-6 border-t">
            <button type="submit" 
                    [disabled]="passwordForm.invalid"
                    class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors">
              Alterar Senha
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
export class ChangePasswordComponent {
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      senhaAtual: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const novaSenha = form.get('novaSenha');
    const confirmarSenha = form.get('confirmarSenha');
    
    if (novaSenha && confirmarSenha && novaSenha.value !== confirmarSenha.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      console.log('Alteração de senha:', this.passwordForm.value);
      // Aqui você implementaria a lógica para alterar a senha
    }
  }
}
