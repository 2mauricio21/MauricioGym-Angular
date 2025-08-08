import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BloqueioService } from '../../../core/services/bloqueio.service';

interface Bloqueio {
  id: number;
  usuarioId: number;
  nomeUsuario: string;
  emailUsuario: string;
  motivo: string;
  dataInicio: Date;
  dataFim?: Date;
  ativo: boolean;
  dataCriacao: Date;
  dataAtualizacao?: Date;
  observacoes?: string;
}

@Component({
  selector: 'app-bloqueio-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
            <h1 class="text-2xl font-bold">Detalhes do Bloqueio</h1>
          </div>
          <div class="flex space-x-2">
            <button 
              [routerLink]="['/bloqueios', bloqueio?.id, 'editar']"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Editar
            </button>
            <button 
              (click)="removerBloqueio()"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Remover
            </button>
          </div>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-500">Carregando...</p>
        </div>

        <div *ngIf="!loading && bloqueio" class="bg-white shadow-md rounded-lg overflow-hidden">
          <!-- Status Badge -->
          <div class="bg-gray-50 px-6 py-4 border-b">
            <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                  [class]="bloqueio.ativo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
              {{ bloqueio.ativo ? 'Bloqueio Ativo' : 'Bloqueio Inativo' }}
            </span>
          </div>

          <!-- Informações do Usuário -->
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Informações do Usuário</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Nome</label>
                <p class="mt-1 text-sm text-gray-900">{{ bloqueio.nomeUsuario }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ bloqueio.emailUsuario }}</p>
              </div>
            </div>
          </div>

          <!-- Detalhes do Bloqueio -->
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Detalhes do Bloqueio</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Data de Início</label>
                <p class="mt-1 text-sm text-gray-900">{{ bloqueio.dataInicio | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Data de Fim</label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ bloqueio.dataFim ? (bloqueio.dataFim | date:'dd/MM/yyyy HH:mm') : 'Indefinido' }}
                </p>
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-500">Motivo</label>
              <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ bloqueio.motivo }}</p>
            </div>
            <div *ngIf="bloqueio.observacoes" class="mt-4">
              <label class="block text-sm font-medium text-gray-500">Observações</label>
              <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ bloqueio.observacoes }}</p>
            </div>
          </div>

          <!-- Informações de Auditoria -->
          <div class="px-6 py-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Informações de Auditoria</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Data de Criação</label>
                <p class="mt-1 text-sm text-gray-900">{{ bloqueio.dataCriacao | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
              <div *ngIf="bloqueio.dataAtualizacao">
                <label class="block text-sm font-medium text-gray-500">Última Atualização</label>
                <p class="mt-1 text-sm text-gray-900">{{ bloqueio.dataAtualizacao | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && !bloqueio" class="text-center py-8">
          <p class="text-gray-500">Bloqueio não encontrado.</p>
        </div>
      </div>
    </div>
  `
})
export class BloqueioDetailComponent implements OnInit {
  bloqueio: Bloqueio | null = null;
  loading = false;
  bloqueioId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bloqueioService: BloqueioService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bloqueioId = +id;
      this.carregarBloqueio();
    }
  }

  carregarBloqueio(): void {
    this.loading = true;
    
    // TODO: Implementar chamada para API
    // this.bloqueioService.obterPorId(this.bloqueioId).subscribe({
    //   next: (bloqueio) => {
    //     this.bloqueio = bloqueio;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar bloqueio:', error);
    //     this.loading = false;
    //   }
    // });
    
    // Mock data para desenvolvimento
    setTimeout(() => {
      if (this.bloqueioId === 1) {
        this.bloqueio = {
          id: 1,
          usuarioId: 1,
          nomeUsuario: 'João Silva',
          emailUsuario: 'joao@email.com',
          motivo: 'Inadimplência - Mensalidade em atraso há mais de 30 dias. Tentativas de contato realizadas sem sucesso.',
          dataInicio: new Date('2024-01-15T08:00:00'),
          dataFim: new Date('2024-02-15T23:59:59'),
          ativo: true,
          dataCriacao: new Date('2024-01-15T08:00:00'),
          dataAtualizacao: new Date('2024-01-20T10:30:00'),
          observacoes: 'Cliente foi notificado sobre o bloqueio por email e telefone.'
        };
      } else {
        this.bloqueio = {
          id: this.bloqueioId,
          usuarioId: 2,
          nomeUsuario: 'Maria Santos',
          emailUsuario: 'maria@email.com',
          motivo: 'Comportamento inadequado nas dependências da academia.',
          dataInicio: new Date('2024-01-10T09:00:00'),
          ativo: false,
          dataCriacao: new Date('2024-01-10T09:00:00')
        };
      }
      this.loading = false;
    }, 500);
  }

  removerBloqueio(): void {
    if (confirm('Tem certeza que deseja remover este bloqueio?')) {
      // TODO: Implementar chamada para API
      // this.bloqueioService.remover(this.bloqueioId).subscribe({
      //   next: () => {
      //     this.router.navigate(['/bloqueios']);
      //   },
      //   error: (error) => {
      //     console.error('Erro ao remover bloqueio:', error);
      //   }
      // });
      
      // Mock para desenvolvimento
      this.router.navigate(['/bloqueios']);
    }
  }

  voltar(): void {
    this.router.navigate(['/bloqueios']);
  }
}