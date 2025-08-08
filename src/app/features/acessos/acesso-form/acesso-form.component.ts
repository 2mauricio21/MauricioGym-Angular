import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AcessoService } from '../../../core/services/acesso.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AcademiaService } from '../../../core/services/academia.service';

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface Academia {
  id: number;
  nome: string;
  endereco: string;
}

interface Equipamento {
  id: number;
  nome: string;
  tipo: string;
}

@Component({
  selector: 'app-acesso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center mb-6">
          <button 
            (click)="voltar()"
            class="mr-4 text-gray-600 hover:text-gray-800">
            ← Voltar
          </button>
          <h1 class="text-2xl font-bold">
            {{ isEditMode ? 'Editar Acesso' : 'Registrar Novo Acesso' }}
          </h1>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6">
          <form [formGroup]="acessoForm" (ngSubmit)="onSubmit()">
            <!-- Usuário -->
            <div class="mb-4">
              <label for="usuarioId" class="block text-sm font-medium text-gray-700 mb-2">
                Usuário *
              </label>
              <select 
                id="usuarioId"
                formControlName="usuarioId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="acessoForm.get('usuarioId')?.invalid && acessoForm.get('usuarioId')?.touched">
                <option value="">Selecione um usuário</option>
                <option *ngFor="let usuario of usuarios" [value]="usuario.id">
                  {{ usuario.nome }} - {{ usuario.email }}
                </option>
              </select>
              <div *ngIf="acessoForm.get('usuarioId')?.invalid && acessoForm.get('usuarioId')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Usuário é obrigatório
              </div>
            </div>

            <!-- Academia -->
            <div class="mb-4">
              <label for="academiaId" class="block text-sm font-medium text-gray-700 mb-2">
                Academia *
              </label>
              <select 
                id="academiaId"
                formControlName="academiaId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="acessoForm.get('academiaId')?.invalid && acessoForm.get('academiaId')?.touched"
                (change)="onAcademiaChange()">
                <option value="">Selecione uma academia</option>
                <option *ngFor="let academia of academias" [value]="academia.id">
                  {{ academia.nome }} - {{ academia.endereco }}
                </option>
              </select>
              <div *ngIf="acessoForm.get('academiaId')?.invalid && acessoForm.get('academiaId')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Academia é obrigatória
              </div>
            </div>

            <!-- Tipo de Acesso -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Acesso *
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    formControlName="tipo" 
                    value="entrada"
                    class="mr-2">
                  <span class="text-sm">Entrada</span>
                </label>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    formControlName="tipo" 
                    value="saida"
                    class="mr-2">
                  <span class="text-sm">Saída</span>
                </label>
              </div>
              <div *ngIf="acessoForm.get('tipo')?.invalid && acessoForm.get('tipo')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Tipo de acesso é obrigatório
              </div>
            </div>

            <!-- Data e Hora -->
            <div class="mb-4">
              <label for="dataHora" class="block text-sm font-medium text-gray-700 mb-2">
                Data e Hora *
              </label>
              <input 
                type="datetime-local"
                id="dataHora"
                formControlName="dataHora"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="acessoForm.get('dataHora')?.invalid && acessoForm.get('dataHora')?.touched">
              <div *ngIf="acessoForm.get('dataHora')?.invalid && acessoForm.get('dataHora')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Data e hora são obrigatórias
              </div>
            </div>

            <!-- Equipamento -->
            <div class="mb-4">
              <label for="equipamentoId" class="block text-sm font-medium text-gray-700 mb-2">
                Equipamento
              </label>
              <select 
                id="equipamentoId"
                formControlName="equipamentoId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selecione um equipamento (opcional)</option>
                <option *ngFor="let equipamento of equipamentos" [value]="equipamento.id">
                  {{ equipamento.nome }} - {{ equipamento.tipo }}
                </option>
              </select>
            </div>

            <!-- Observações -->
            <div class="mb-6">
              <label for="observacoes" class="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea 
                id="observacoes"
                formControlName="observacoes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações adicionais sobre o acesso..."></textarea>
            </div>

            <!-- Validado -->
            <div class="mb-6" *ngIf="isEditMode">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  formControlName="validado"
                  class="mr-2">
                <span class="text-sm font-medium text-gray-700">Acesso validado</span>
              </label>
            </div>

            <!-- Botões -->
            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                (click)="voltar()"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Cancelar
              </button>
              <button 
                type="submit"
                [disabled]="acessoForm.invalid || loading"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ loading ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Registrar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AcessoFormComponent implements OnInit {
  acessoForm: FormGroup;
  isEditMode = false;
  loading = false;
  acessoId: number | null = null;
  
  usuarios: Usuario[] = [];
  academias: Academia[] = [];
  equipamentos: Equipamento[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private acessoService: AcessoService,
    private usuarioService: UsuarioService,
    private academiaService: AcademiaService
  ) {
    this.acessoForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.acessoId = +id;
      this.carregarAcesso();
    }
    
    this.carregarUsuarios();
    this.carregarAcademias();
    
    // Definir data/hora atual como padrão
    if (!this.isEditMode) {
      const agora = new Date();
      const dataHoraLocal = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
        .toISOString().slice(0, 16);
      this.acessoForm.patchValue({ dataHora: dataHoraLocal });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      usuarioId: ['', Validators.required],
      academiaId: ['', Validators.required],
      tipo: ['entrada', Validators.required],
      dataHora: ['', Validators.required],
      equipamentoId: [''],
      observacoes: [''],
      validado: [false]
    });
  }

  carregarAcesso(): void {
    if (!this.acessoId) return;
    
    // TODO: Implementar chamada para API
    // this.acessoService.obterPorId(this.acessoId).subscribe({
    //   next: (acesso) => {
    //     this.acessoForm.patchValue({
    //       usuarioId: acesso.usuarioId,
    //       academiaId: acesso.academiaId,
    //       tipo: acesso.tipo,
    //       dataHora: new Date(acesso.dataHora).toISOString().slice(0, 16),
    //       equipamentoId: acesso.equipamentoId || '',
    //       observacoes: acesso.observacoes || '',
    //       validado: acesso.validado
    //     });
    //     this.onAcademiaChange();
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar acesso:', error);
    //   }
    // });
    
    // Mock data para desenvolvimento
    setTimeout(() => {
      this.acessoForm.patchValue({
        usuarioId: 1,
        academiaId: 1,
        tipo: 'entrada',
        dataHora: '2024-01-20T08:30',
        equipamentoId: 1,
        observacoes: 'Acesso registrado manualmente',
        validado: true
      });
      this.onAcademiaChange();
    }, 500);
  }

  carregarUsuarios(): void {
    // TODO: Implementar chamada para API
    // this.usuarioService.listar().subscribe({
    //   next: (usuarios) => {
    //     this.usuarios = usuarios;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar usuários:', error);
    //   }
    // });
    
    // Mock data para desenvolvimento
    this.usuarios = [
      { id: 1, nome: 'João Silva', email: 'joao@email.com' },
      { id: 2, nome: 'Maria Santos', email: 'maria@email.com' },
      { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com' }
    ];
  }

  carregarAcademias(): void {
    // TODO: Implementar chamada para API
    // this.academiaService.listar().subscribe({
    //   next: (academias) => {
    //     this.academias = academias;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar academias:', error);
    //   }
    // });
    
    // Mock data para desenvolvimento
    this.academias = [
      { id: 1, nome: 'Academia Central', endereco: 'Rua Principal, 123' },
      { id: 2, nome: 'Academia Norte', endereco: 'Av. Norte, 456' },
      { id: 3, nome: 'Academia Sul', endereco: 'Rua Sul, 789' }
    ];
  }

  onAcademiaChange(): void {
    const academiaId = this.acessoForm.get('academiaId')?.value;
    if (academiaId) {
      this.carregarEquipamentos(academiaId);
    } else {
      this.equipamentos = [];
    }
  }

  carregarEquipamentos(academiaId: number): void {
    // TODO: Implementar chamada para API
    // this.equipamentoService.listarPorAcademia(academiaId).subscribe({
    //   next: (equipamentos) => {
    //     this.equipamentos = equipamentos;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar equipamentos:', error);
    //   }
    // });
    
    // Mock data para desenvolvimento
    this.equipamentos = [
      { id: 1, nome: 'Catraca Principal', tipo: 'Catraca' },
      { id: 2, nome: 'Catraca Secundária', tipo: 'Catraca' },
      { id: 3, nome: 'Leitor Biométrico', tipo: 'Biometria' }
    ];
  }

  onSubmit(): void {
    if (this.acessoForm.valid) {
      this.loading = true;
      const formData = this.acessoForm.value;
      
      // Converter data/hora para formato ISO
      formData.dataHora = new Date(formData.dataHora).toISOString();
      
      if (this.isEditMode && this.acessoId) {
        // TODO: Implementar chamada para API de atualização
        // this.acessoService.atualizar(this.acessoId, formData).subscribe({
        //   next: () => {
        //     this.router.navigate(['/acessos']);
        //   },
        //   error: (error) => {
        //     console.error('Erro ao atualizar acesso:', error);
        //     this.loading = false;
        //   }
        // });
        
        // Mock para desenvolvimento
        setTimeout(() => {
          this.router.navigate(['/acessos']);
        }, 1000);
      } else {
        // TODO: Implementar chamada para API de criação
        // this.acessoService.registrarAcesso(formData).subscribe({
        //   next: () => {
        //     this.router.navigate(['/acessos']);
        //   },
        //   error: (error) => {
        //     console.error('Erro ao registrar acesso:', error);
        //     this.loading = false;
        //   }
        // });
        
        // Mock para desenvolvimento
        setTimeout(() => {
          this.router.navigate(['/acessos']);
        }, 1000);
      }
    }
  }

  voltar(): void {
    this.router.navigate(['/acessos']);
  }
}