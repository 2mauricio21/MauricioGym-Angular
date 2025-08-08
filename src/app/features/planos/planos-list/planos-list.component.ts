import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-planos-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Planos</h1>
        <button 
          routerLink="/planos/novo"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Novo Plano
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input 
              type="text" 
              [(ngModel)]="filtros.busca"
              (input)="aplicarFiltros()"
              placeholder="Nome ou descrição..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              [(ngModel)]="filtros.status"
              (change)="aplicarFiltros()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Valor Mínimo</label>
            <input 
              type="number" 
              [(ngModel)]="filtros.valorMin"
              (input)="aplicarFiltros()"
              placeholder="0,00"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Valor Máximo</label>
            <input 
              type="number" 
              [(ngModel)]="filtros.valorMax"
              (input)="aplicarFiltros()"
              placeholder="999,99"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total de Planos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estatisticas.total }}</p>
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
              <p class="text-sm font-medium text-gray-600">Planos Ativos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estatisticas.ativos }}</p>
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
              <p class="text-sm font-medium text-gray-600">Valor Médio</p>
              <p class="text-2xl font-semibold text-gray-900">R$ {{ estatisticas.valorMedio | number:'1.2-2' }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Assinantes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estatisticas.totalAssinantes }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Planos -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium">Lista de Planos ({{ planosFiltrados.length }})</h2>
        </div>
        
        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-500">Carregando...</p>
        </div>

        <div *ngIf="!loading && planosFiltrados.length === 0" class="text-center py-8">
          <p class="text-gray-500">Nenhum plano encontrado.</p>
        </div>

        <div *ngIf="!loading && planosFiltrados.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duração</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assinantes</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let plano of planosFiltrados" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ plano.nome }}</div>
                    <div class="text-sm text-gray-500">{{ plano.descricao }}</div>
                    <div *ngIf="plano.beneficios.length > 0" class="mt-1">
                      <span *ngFor="let beneficio of plano.beneficios.slice(0, 2)" 
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                        {{ beneficio }}
                      </span>
                      <span *ngIf="plano.beneficios.length > 2" 
                            class="text-xs text-gray-500">+{{ plano.beneficios.length - 2 }} mais</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">R$ {{ plano.valor | number:'1.2-2' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ plano.duracaoMeses }} {{ plano.duracaoMeses === 1 ? 'mês' : 'meses' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        [class]="plano.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ plano.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getAssinantesCount(plano.id) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      [routerLink]="['/planos', plano.id]"
                      class="text-blue-600 hover:text-blue-900">Ver</button>
                    <button 
                      [routerLink]="['/planos', plano.id, 'editar']"
                      class="text-indigo-600 hover:text-indigo-900">Editar</button>
                    <button 
                      (click)="toggleStatus(plano)"
                      [class]="plano.ativo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                      {{ plano.ativo ? 'Desativar' : 'Ativar' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PlanosListComponent implements OnInit {
  planos: Plano[] = [];
  planosFiltrados: Plano[] = [];
  loading = false;
  
  filtros = {
    busca: '',
    status: '',
    valorMin: null as number | null,
    valorMax: null as number | null
  };

  estatisticas = {
    total: 0,
    ativos: 0,
    valorMedio: 0,
    totalAssinantes: 0
  };

  constructor() {}

  ngOnInit(): void {
    this.carregarPlanos();
    this.carregarEstatisticas();
  }

  carregarPlanos(): void {
    this.loading = true;
    
    // TODO: Implementar chamada para API
    setTimeout(() => {
      this.planos = [
        {
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
        },
        {
          id: 2,
          nome: 'Plano Premium',
          descricao: 'Acesso completo + aulas coletivas e personal trainer',
          valor: 149.90,
          duracaoMeses: 1,
          ativo: true,
          beneficios: ['Musculação', 'Cardio', 'Aulas Coletivas', 'Personal Trainer', 'Vestiário'],
          limitesAcesso: {
            horarios: '24 horas'
          },
          dataCriacao: new Date('2024-01-01'),
          dataAtualizacao: new Date('2024-01-10')
        },
        {
          id: 3,
          nome: 'Plano Anual',
          descricao: 'Plano com desconto para pagamento anual',
          valor: 79.90,
          duracaoMeses: 12,
          ativo: true,
          beneficios: ['Musculação', 'Cardio', 'Aulas Coletivas', 'Vestiário', 'Desconto Anual'],
          limitesAcesso: {
            horarios: '06:00 às 22:00'
          },
          dataCriacao: new Date('2024-01-01'),
          dataAtualizacao: new Date('2024-01-05')
        },
        {
          id: 4,
          nome: 'Plano Estudante',
          descricao: 'Plano especial para estudantes com desconto',
          valor: 59.90,
          duracaoMeses: 1,
          ativo: false,
          beneficios: ['Musculação', 'Cardio', 'Vestiário'],
          limitesAcesso: {
            horarios: '06:00 às 18:00'
          },
          dataCriacao: new Date('2024-01-01'),
          dataAtualizacao: new Date('2024-01-20')
        }
      ];
      this.aplicarFiltros();
      this.loading = false;
    }, 500);
  }

  carregarEstatisticas(): void {
    // TODO: Implementar chamada para API
    setTimeout(() => {
      this.estatisticas = {
        total: this.planos.length,
        ativos: this.planos.filter(p => p.ativo).length,
        valorMedio: this.planos.reduce((acc, p) => acc + p.valor, 0) / this.planos.length,
        totalAssinantes: 156
      };
    }, 600);
  }

  aplicarFiltros(): void {
    this.planosFiltrados = this.planos.filter(plano => {
      const matchBusca = !this.filtros.busca || 
        plano.nome.toLowerCase().includes(this.filtros.busca.toLowerCase()) ||
        plano.descricao.toLowerCase().includes(this.filtros.busca.toLowerCase());
      
      const matchStatus = !this.filtros.status || 
        (this.filtros.status === 'ativo' && plano.ativo) ||
        (this.filtros.status === 'inativo' && !plano.ativo);
      
      const matchValorMin = this.filtros.valorMin === null || plano.valor >= this.filtros.valorMin;
      const matchValorMax = this.filtros.valorMax === null || plano.valor <= this.filtros.valorMax;
      
      return matchBusca && matchStatus && matchValorMin && matchValorMax;
    });
  }

  getAssinantesCount(planoId: number): number {
    // TODO: Implementar chamada para API para obter contagem real
    const counts: { [key: number]: number } = {
      1: 45,
      2: 78,
      3: 23,
      4: 10
    };
    return counts[planoId] || 0;
  }

  toggleStatus(plano: Plano): void {
    const acao = plano.ativo ? 'desativar' : 'ativar';
    if (confirm(`Confirma ${acao} o plano "${plano.nome}"?`)) {
      // TODO: Implementar chamada para API
      plano.ativo = !plano.ativo;
      plano.dataAtualizacao = new Date();
      this.carregarEstatisticas();
    }
  }
}
