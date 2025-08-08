import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BloqueioService } from '../../../core/services/bloqueio.service';
import { UsuarioService } from '../../../core/services/usuario.service';

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

@Component({
  selector: 'app-bloqueio-form',
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
            {{ isEdicao ? 'Editar Bloqueio' : 'Novo Bloqueio' }}
          </h1>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6">
          <form [formGroup]="bloqueioForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="usuarioId" class="block text-sm font-medium text-gray-700 mb-2">
                Usuário *
              </label>
              <select 
                id="usuarioId"
                formControlName="usuarioId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="bloqueioForm.get('usuarioId')?.invalid && bloqueioForm.get('usuarioId')?.touched">
                <option value="">Selecione um usuário</option>
                <option *ngFor="let usuario of usuarios" [value]="usuario.id">
                  {{ usuario.nome }} - {{ usuario.email }}
                </option>
              </select>
              <div *ngIf="bloqueioForm.get('usuarioId')?.invalid && bloqueioForm.get('usuarioId')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Usuário é obrigatório
              </div>
            </div>

            <div class="mb-4">
              <label for="motivo" class="block text-sm font-medium text-gray-700 mb-2">
                Motivo *
              </label>
              <textarea 
                id="motivo"
                formControlName="motivo"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="bloqueioForm.get('motivo')?.invalid && bloqueioForm.get('motivo')?.touched"
                placeholder="Descreva o motivo do bloqueio">
              </textarea>
              <div *ngIf="bloqueioForm.get('motivo')?.invalid && bloqueioForm.get('motivo')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Motivo é obrigatório
              </div>
            </div>

            <div class="mb-4">
              <label for="dataInicio" class="block text-sm font-medium text-gray-700 mb-2">
                Data de Início *
              </label>
              <input 
                type="date"
                id="dataInicio"
                formControlName="dataInicio"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="bloqueioForm.get('dataInicio')?.invalid && bloqueioForm.get('dataInicio')?.touched">
              <div *ngIf="bloqueioForm.get('dataInicio')?.invalid && bloqueioForm.get('dataInicio')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Data de início é obrigatória
              </div>
            </div>

            <div class="mb-4">
              <label for="dataFim" class="block text-sm font-medium text-gray-700 mb-2">
                Data de Fim
              </label>
              <input 
                type="date"
                id="dataFim"
                formControlName="dataFim"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <p class="text-sm text-gray-500 mt-1">
                Deixe em branco para bloqueio indefinido
              </p>
            </div>

            <div class="mb-6">
              <label class="flex items-center">
                <input 
                  type="checkbox"
                  formControlName="ativo"
                  class="mr-2">
                <span class="text-sm font-medium text-gray-700">
                  Bloqueio ativo
                </span>
              </label>
            </div>

            <div class="flex justify-end space-x-4">
              <button 
                type="button"
                (click)="voltar()"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button 
                type="submit"
                [disabled]="bloqueioForm.invalid || loading"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ loading ? 'Salvando...' : (isEdicao ? 'Atualizar' : 'Criar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class BloqueioFormComponent implements OnInit {
  bloqueioForm: FormGroup;
  usuarios: Usuario[] = [];
  loading = false;
  isEdicao = false;
  bloqueioId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bloqueioService: BloqueioService,
    private usuarioService: UsuarioService
  ) {
    this.bloqueioForm = this.fb.group({
      usuarioId: ['', Validators.required],
      motivo: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: [''],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    this.carregarUsuarios();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'novo') {
      this.isEdicao = true;
      this.bloqueioId = +id;
      this.carregarBloqueio(this.bloqueioId);
    }
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

  carregarBloqueio(id: number): void {
    // TODO: Implementar chamada para API
    // this.bloqueioService.obterPorId(id).subscribe({
    //   next: (bloqueio) => {
    //     this.bloqueioForm.patchValue({
    //       usuarioId: bloqueio.usuarioId,
    //       motivo: bloqueio.motivo,
    //       dataInicio: this.formatDate(bloqueio.dataInicio),
    //       dataFim: bloqueio.dataFim ? this.formatDate(bloqueio.dataFim) : '',
    //       ativo: bloqueio.ativo
    //     });
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar bloqueio:', error);
    //   }
    // });
    
    // Mock data para desenvolvimento
    if (id === 1) {
      this.bloqueioForm.patchValue({
        usuarioId: 1,
        motivo: 'Inadimplência',
        dataInicio: '2024-01-15',
        dataFim: '2024-02-15',
        ativo: true
      });
    }
  }

  onSubmit(): void {
    if (this.bloqueioForm.valid) {
      this.loading = true;
      const formData = this.bloqueioForm.value;
      
      // TODO: Implementar chamada para API
      if (this.isEdicao) {
        // this.bloqueioService.atualizar(this.bloqueioId!, formData).subscribe({
        //   next: () => {
        //     this.router.navigate(['/bloqueios']);
        //   },
        //   error: (error) => {
        //     console.error('Erro ao atualizar bloqueio:', error);
        //     this.loading = false;
        //   }
        // });
      } else {
        // this.bloqueioService.criar(formData).subscribe({
        //   next: () => {
        //     this.router.navigate(['/bloqueios']);
        //   },
        //   error: (error) => {
        //     console.error('Erro ao criar bloqueio:', error);
        //     this.loading = false;
        //   }
        // });
      }
      
      // Mock para desenvolvimento
      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/bloqueios']);
      }, 1000);
    }
  }

  voltar(): void {
    this.router.navigate(['/bloqueios']);
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }
}
