import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

interface Plano {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  duracaoMeses: number;
  ativo: boolean;
  beneficios: string[];
  limitesAcesso?: {
    academias?: number[];
    horarios?: string;
    equipamentos?: string[];
  };
  dataCriacao: Date;
  dataAtualizacao: Date;
}

interface AssinanteInfo {
  id: number;
  nome: string;
  email: string;
  dataInicio: Date;
  dataFim: Date;
  status: 'ativo' | 'vencido' | 'cancelado';
}

interface EstatisticasPlano {
  totalAssinantes: number;
  assinantesAtivos: number;
  receitaMensal: number;
  receitaTotal: number;
  mediaAvaliacoes: number;
  totalAvaliacoes: number;
}

@Component({
  selector: 'app-plano-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <button 
              (click)="voltar()"
              class="mr-4 text-gray-600 hover:text-gray-800">
              ← Voltar
            </button>
            <h1 class="text-2xl font-bold">Detalhes do Plano</h1>
          </div>
          <div class="flex space-x-2">
            <button 
              [routerLink]="['/planos', plano?.id, 'editar']"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Editar
            </button>
            <button 
              (click)="toggleStatus()"
              [class]="plano?.ativo ? 'px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600' : 'px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600'">
              {{ plano?.ativo ? 'Desativar' : 'Ativar' }}
            </button>
          </div>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-500">Carregando...</p>
        </div>

        <div *ngIf="!loading && plano" class="space-y-6">
          <!-- Informações Básicas -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <h2 class="text-2xl font-bold text-gray-900 mr-3">{{ plano.nome }}</h2>
                  <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                        [class]="plano.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ plano.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </div>
                <p class="text-gray-600 mb-4">{{ plano.descricao }}</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Valor Mensal</label>
                    <p class="text-2xl font-bold text-green-600">R$ {{ plano.valor | number:'1.2-2' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Duração</label>
                    <p class="text-lg font-medium text-gray-900">{{ plano.duracaoMeses }} {{ plano.duracaoMeses === 1 ? 'mês' : 'meses' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Valor Total</label>
                    <p class="text-lg font-medium text-gray-900">R$ {{ (plano.valor * plano.duracaoMeses) | number:'1.2-2' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Estatísticas -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg shadow p-4">
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Total Assinantes</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ estatisticas.totalAssinantes }}</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
              <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Assinantes Ativos</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ estatisticas.assinantesAtivos }}</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
              <div class="flex items-center">
                <div class="p-2 bg-yellow-100 rounded-lg">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Receita Mensal</p>
                  <p class="text-2xl font-semibold text-gray-900">R$ {{ estatisticas.receitaMensal | number:'1.2-2' }}</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
              <div class="flex items-center">
                <div class="p-2 bg-purple-100 rounded-lg">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Avaliação Média</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ estatisticas.mediaAvaliacoes | number:'1.1-1' }}/5</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Benefícios -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-4">Benefícios Inclusos</h3>
              <div class="space-y-2">
                <div *ngFor="let beneficio of plano.beneficios" class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700">{{ beneficio }}</span>
                </div>
              </div>
            </div>

            <!-- Limites de Acesso -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-4">Limites de Acesso</h3>
              <div class="space-y-3">
                <div *ngIf="plano.limitesAcesso?.horarios">
                  <label class="block text-sm font-medium text-gray-600">Horários</label>
                  <p class="text-gray-900">{{ plano.limitesAcesso?.horarios }}</p>
                </div>
                <div *ngIf="plano.limitesAcesso?.academias && (plano.limitesAcesso?.academias?.length || 0) > 0">
                  <label class="block text-sm font-medium text-gray-600">Academias Permitidas</label>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span *ngFor="let academiaId of plano.limitesAcesso?.academias" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Academia {{ academiaId }}
                    </span>
                  </div>
                </div>
                <div *ngIf="plano.limitesAcesso?.equipamentos && (plano.limitesAcesso?.equipamentos?.length || 0) > 0">
                  <label class="block text-sm font-medium text-gray-600">Equipamentos Permitidos</label>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span *ngFor="let equipamento of plano.limitesAcesso?.equipamentos" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ equipamento }}
                    </span>
                  </div>
                </div>
                <div *ngIf="!plano.limitesAcesso?.horarios && (!plano.limitesAcesso?.academias || plano.limitesAcesso?.academias?.length === 0) && (!plano.limitesAcesso?.equipamentos || plano.limitesAcesso?.equipamentos?.length === 0)">
                  <p class="text-gray-500 italic">Sem restrições de acesso</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Assinantes Recentes -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Assinantes Recentes</h3>
              <button class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                Ver todos
              </button>
            </div>
            <div *ngIf="assinantesRecentes.length > 0" class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-2 text-sm font-medium text-gray-600">Nome</th>
                    <th class="text-left py-2 text-sm font-medium text-gray-600">Email</th>
                    <th class="text-left py-2 text-sm font-medium text-gray-600">Início</th>
                    <th class="text-left py-2 text-sm font-medium text-gray-600">Vencimento</th>
                    <th class="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let assinante of assinantesRecentes" class="border-b border-gray-100">
                    <td class="py-3 text-sm text-gray-900">{{ assinante.nome }}</td>
                    <td class="py-3 text-sm text-gray-600">{{ assinante.email }}</td>
                    <td class="py-3 text-sm text-gray-600">{{ assinante.dataInicio | date:'dd/MM/yyyy' }}</td>
                    <td class="py-3 text-sm text-gray-600">{{ assinante.dataFim | date:'dd/MM/yyyy' }}</td>
                    <td class="py-3">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                            [class]="getStatusClass(assinante.status)">
                        {{ getStatusText(assinante.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div *ngIf="assinantesRecentes.length === 0" class="text-center py-4">
              <p class="text-gray-500">Nenhum assinante encontrado.</p>
            </div>
          </div>

          <!-- Informações de Auditoria -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Informações de Auditoria</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Data de Criação</label>
                <p class="mt-1 text-sm text-gray-900">{{ plano.dataCriacao | date:'dd/MM/yyyy HH:mm:ss' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Última Atualização</label>
                <p class="mt-1 text-sm text-gray-900">{{ plano.dataAtualizacao | date:'dd/MM/yyyy HH:mm:ss' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && !plano" class="text-center py-8">
          <p class="text-gray-500">Plano não encontrado.</p>
        </div>
      </div>
    </div>
  `
})
export class PlanoDetailComponent implements OnInit {
  plano: Plano | null = null;
  assinantesRecentes: AssinanteInfo[] = [];
  estatisticas: EstatisticasPlano = {
    totalAssinantes: 0,
    assinantesAtivos: 0,
    receitaMensal: 0,
    receitaTotal: 0,
    mediaAvaliacoes: 0,
    totalAvaliacoes: 0
  };
  loading = false;
  planoId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.planoId = +id;
      this.carregarPlano();
      this.carregarEstatisticas();
      this.carregarAssinantesRecentes();
    }
  }

  carregarPlano(): void {
    this.loading = true;
    
    // TODO: Implementar chamada para API
    setTimeout(() => {
      if (this.planoId === 1) {
        this.plano = {
          id: 1,
          nome: 'Plano Básico',
          descricao: 'Acesso completo à academia com horários flexíveis',
          valor: 89.90,
          duracaoMeses: 1,
          ativo: true,
          beneficios: ['Musculação', 'Cardio', 'Vestiário'],
          limitesAcesso: {
            horarios: '06:00 às 22:00'
          },
          dataCriacao: new Date('2024-01-01'),
          dataAtualizacao: new Date('2024-01-15')
        };
      } else {
        this.plano = {
          id: this.planoId,
          nome: 'Plano Premium',
          descricao: 'Acesso completo + aulas coletivas e personal trainer',
          valor: 149.90,
          duracaoMeses: 1,
          ativo: true,
          beneficios: ['Musculação', 'Cardio', 'Aulas Coletivas', 'Personal Trainer', 'Vestiário'],
          limitesAcesso: {
            horarios: '24 horas',
            academias: [1, 2],
            equipamentos: ['Esteira', 'Bicicleta', 'Supino']
          },
          dataCriacao: new Date('2024-01-01'),
          dataAtualizacao: new Date('2024-01-10')
        };
      }
      this.loading = false;
    }, 500);
  }

  carregarEstatisticas(): void {
    // TODO: Implementar chamada para API
    setTimeout(() => {
      this.estatisticas = {
        totalAssinantes: 78,
        assinantesAtivos: 65,
        receitaMensal: 11687.00,
        receitaTotal: 35061.00,
        mediaAvaliacoes: 4.2,
        totalAvaliacoes: 45
      };
    }, 600);
  }

  carregarAssinantesRecentes(): void {
    // TODO: Implementar chamada para API
    setTimeout(() => {
      this.assinantesRecentes = [
        {
          id: 1,
          nome: 'João Silva',
          email: 'joao@email.com',
          dataInicio: new Date('2024-01-15'),
          dataFim: new Date('2024-02-15'),
          status: 'ativo'
        },
        {
          id: 2,
          nome: 'Maria Santos',
          email: 'maria@email.com',
          dataInicio: new Date('2024-01-10'),
          dataFim: new Date('2024-02-10'),
          status: 'ativo'
        },
        {
          id: 3,
          nome: 'Pedro Costa',
          email: 'pedro@email.com',
          dataInicio: new Date('2024-01-05'),
          dataFim: new Date('2024-01-20'),
          status: 'vencido'
        }
      ];
    }, 700);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'vencido':
        return 'Vencido';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  }

  toggleStatus(): void {
    if (this.plano) {
      const acao = this.plano.ativo ? 'desativar' : 'ativar';
      if (confirm(`Confirma ${acao} o plano "${this.plano.nome}"?`)) {
        // TODO: Implementar chamada para API
        this.plano.ativo = !this.plano.ativo;
        this.plano.dataAtualizacao = new Date();
      }
    }
  }

  voltar(): void {
    this.router.navigate(['/planos']);
  }
}