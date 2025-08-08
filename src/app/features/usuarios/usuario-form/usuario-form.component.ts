import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface Usuario {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: Date;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  ativo: boolean;
  observacoes?: string;
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <button 
              (click)="voltar()"
              class="mr-4 text-gray-600 hover:text-gray-800">
              ← Voltar
            </button>
            <h1 class="text-2xl font-bold">{{ isEdicao ? 'Editar Usuário' : 'Novo Usuário' }}</h1>
          </div>
        </div>

        <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Informações Pessoais -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Informações Pessoais</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                <input 
                  type="text" 
                  formControlName="nome"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('nome')?.invalid && usuarioForm.get('nome')?.touched">
                <div *ngIf="usuarioForm.get('nome')?.invalid && usuarioForm.get('nome')?.touched" class="text-red-500 text-sm mt-1">
                  Nome é obrigatório
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('email')?.invalid && usuarioForm.get('email')?.touched">
                <div *ngIf="usuarioForm.get('email')?.invalid && usuarioForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
                  <span *ngIf="usuarioForm.get('email')?.errors?.['required']">Email é obrigatório</span>
                  <span *ngIf="usuarioForm.get('email')?.errors?.['email']">Email inválido</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                <input 
                  type="tel" 
                  formControlName="telefone"
                  placeholder="(11) 99999-9999"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('telefone')?.invalid && usuarioForm.get('telefone')?.touched">
                <div *ngIf="usuarioForm.get('telefone')?.invalid && usuarioForm.get('telefone')?.touched" class="text-red-500 text-sm mt-1">
                  Telefone é obrigatório
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                <input 
                  type="text" 
                  formControlName="cpf"
                  placeholder="000.000.000-00"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('cpf')?.invalid && usuarioForm.get('cpf')?.touched">
                <div *ngIf="usuarioForm.get('cpf')?.invalid && usuarioForm.get('cpf')?.touched" class="text-red-500 text-sm mt-1">
                  CPF é obrigatório
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
                <input 
                  type="date" 
                  formControlName="dataNascimento"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('dataNascimento')?.invalid && usuarioForm.get('dataNascimento')?.touched">
                <div *ngIf="usuarioForm.get('dataNascimento')?.invalid && usuarioForm.get('dataNascimento')?.touched" class="text-red-500 text-sm mt-1">
                  Data de nascimento é obrigatória
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  formControlName="ativo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option [value]="true">Ativo</option>
                  <option [value]="false">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Endereço -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Endereço</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                <input 
                  type="text" 
                  formControlName="cep"
                  placeholder="00000-000"
                  (blur)="buscarCep()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('cep')?.invalid && usuarioForm.get('cep')?.touched">
                <div *ngIf="usuarioForm.get('cep')?.invalid && usuarioForm.get('cep')?.touched" class="text-red-500 text-sm mt-1">
                  CEP é obrigatório
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Logradouro *</label>
                <input 
                  type="text" 
                  formControlName="logradouro"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('logradouro')?.invalid && usuarioForm.get('logradouro')?.touched">
                <div *ngIf="usuarioForm.get('logradouro')?.invalid && usuarioForm.get('logradouro')?.touched" class="text-red-500 text-sm mt-1">
                  Logradouro é obrigatório
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                <input 
                  type="text" 
                  formControlName="numero"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('numero')?.invalid && usuarioForm.get('numero')?.touched">
                <div *ngIf="usuarioForm.get('numero')?.invalid && usuarioForm.get('numero')?.touched" class="text-red-500 text-sm mt-1">
                  Número é obrigatório
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                <input 
                  type="text" 
                  formControlName="complemento"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                <input 
                  type="text" 
                  formControlName="bairro"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('bairro')?.invalid && usuarioForm.get('bairro')?.touched">
                <div *ngIf="usuarioForm.get('bairro')?.invalid && usuarioForm.get('bairro')?.touched" class="text-red-500 text-sm mt-1">
                  Bairro é obrigatório
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                <input 
                  type="text" 
                  formControlName="cidade"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('cidade')?.invalid && usuarioForm.get('cidade')?.touched">
                <div *ngIf="usuarioForm.get('cidade')?.invalid && usuarioForm.get('cidade')?.touched" class="text-red-500 text-sm mt-1">
                  Cidade é obrigatória
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                <select 
                  formControlName="estado"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="usuarioForm.get('estado')?.invalid && usuarioForm.get('estado')?.touched">
                  <option value="">Selecione o estado</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <!-- Adicionar outros estados conforme necessário -->
                </select>
                <div *ngIf="usuarioForm.get('estado')?.invalid && usuarioForm.get('estado')?.touched" class="text-red-500 text-sm mt-1">
                  Estado é obrigatório
                </div>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Observações</h2>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea 
                formControlName="observacoes"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações adicionais sobre o usuário..."></textarea>
            </div>
          </div>

          <!-- Botões -->
          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              (click)="voltar()"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button 
              type="submit"
              [disabled]="usuarioForm.invalid"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {{ isEdicao ? 'Atualizar' : 'Criar' }} Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  isEdicao = false;
  usuarioId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      ativo: [true],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.params['id'];
    this.isEdicao = !!this.usuarioId;

    if (this.isEdicao) {
      this.carregarUsuario();
    }
  }

  carregarUsuario(): void {
    // TODO: Implementar carregamento do usuário via API
    // Dados mockados para desenvolvimento
    const usuarioMock: Usuario = {
      id: this.usuarioId,
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      dataNascimento: new Date('1990-01-01'),
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua das Flores',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      ativo: true,
      observacoes: 'Cliente VIP'
    };

    this.preencherForm(usuarioMock);
  }

  preencherForm(usuario: Usuario): void {
    this.usuarioForm.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
      dataNascimento: usuario.dataNascimento,
      ativo: usuario.ativo,
      cep: usuario.endereco.cep,
      logradouro: usuario.endereco.logradouro,
      numero: usuario.endereco.numero,
      complemento: usuario.endereco.complemento,
      bairro: usuario.endereco.bairro,
      cidade: usuario.endereco.cidade,
      estado: usuario.endereco.estado,
      observacoes: usuario.observacoes
    });
  }

  buscarCep(): void {
    const cep = this.usuarioForm.get('cep')?.value;
    if (cep && cep.length === 9) {
      // TODO: Implementar busca de CEP via API
      // Dados mockados para desenvolvimento
      const enderecoMock = {
        logradouro: 'Rua das Flores',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP'
      };

      this.usuarioForm.patchValue(enderecoMock);
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formData = this.usuarioForm.value;
      const usuario: Usuario = {
        id: this.usuarioId,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
        endereco: {
          cep: formData.cep,
          logradouro: formData.logradouro,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado
        },
        ativo: formData.ativo,
        observacoes: formData.observacoes
      };

      if (this.isEdicao) {
        // TODO: Implementar atualização via API
        console.log('Atualizando usuário:', usuario);
      } else {
        // TODO: Implementar criação via API
        console.log('Criando usuário:', usuario);
      }

      this.voltar();
    }
  }

  voltar(): void {
    this.router.navigate(['/usuarios']);
  }
}
