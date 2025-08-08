import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AcessoService } from '../../../core/services/acesso.service';

interface Acesso {
  id: number;
  usuarioId: number;
  nomeUsuario: string;
  academiaId: number;
  nomeAcademia: string;
  dataHora: Date;
  tipo: 'entrada' | 'saida';
  equipamentoId?: number;
  nomeEquipamento?: string;
  validado: boolean;
  observacoes?: string;
}

@Component({
  selector: 'app-acessos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Controle de Acessos</h1>
        <button 
          routerLink="/acessos/novo"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
          Registrar Acesso
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Filtros</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md" [(ngModel)]="filtroTipo">
              <option value="">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md" [(ngModel)]="filtroValidado">
              <option value="">Todos</option>
              <option value="true">Validado</option>
              <option value="false">Não Validado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data</label>
            <input 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              [(ngModel)]="filtroData">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Usuário</label>
            <input 
              type="text" 
              placeholder="Nome do usuário"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              [(ngModel)]="filtroUsuario">
          </div>
        </div>
        <div class="mt-4 flex space-x-2">
          <button 
            (click)="aplicarFiltros()"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Aplicar Filtros
          </button>
          <button 
            (click)="limparFiltros()"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
            Limpar
          </button>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Hoje</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.totalHoje }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Entradas</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.entradas }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Saídas</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.saidas }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Não Validados</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.naoValidados }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Acessos -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Acessos Recentes</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academia</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipamento</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let acesso of acessosFiltrados" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ acesso.dataHora | date:'dd/MM/yyyy HH:mm' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ acesso.nomeUsuario }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ acesso.nomeAcademia }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        [class]="acesso.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ acesso.tipo | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ acesso.nomeEquipamento || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        [class]="acesso.validado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ acesso.validado ? 'Validado' : 'Pendente' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      [routerLink]="['/acessos', acesso.id]"
                      class="text-blue-600 hover:text-blue-900">Ver</button>
                    <button 
                      *ngIf="!acesso.validado"
                      (click)="validarAcesso(acesso.id)"
                      class="text-green-600 hover:text-green-900">Validar</button>
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
export class AcessosListComponent implements OnInit {
  acessos: Acesso[] = [];
  acessosFiltrados: Acesso[] = [];
  
  // Filtros
  filtroTipo = '';
  filtroValidado = '';
  filtroData = '';
  filtroUsuario = '';
  
  // Estatísticas
  estatisticas = {
    totalHoje: 0,
    entradas: 0,
    saidas: 0,
    naoValidados: 0
  };

  constructor(
    private acessoService: AcessoService
  ) {}

  ngOnInit(): void {
    this.carregarAcessos();
    this.carregarEstatisticas();
  }

  carregarAcessos(): void {
    // TODO: Implementar chamada para API
    // this.acessoService.listar().subscribe({
    //   next: (acessos) => {
    //     this.acessos = acessos;
    //     this.acessosFiltrados = acessos;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar acessos:', error);
    //   }
    // });
    
    // Mock data para desenvolvimento
    this.acessos = [
      {
        id: 1,
        usuarioId: 1,
        nomeUsuario: 'João Silva',
        academiaId: 1,
        nomeAcademia: 'Academia Central',
        dataHora: new Date('2024-01-20T08:30:00'),
        tipo: 'entrada',
        equipamentoId: 1,
        nomeEquipamento: 'Catraca Principal',
        validado: true
      },
      {
        id: 2,
        usuarioId: 2,
        nomeUsuario: 'Maria Santos',
        academiaId: 1,
        nomeAcademia: 'Academia Central',
        dataHora: new Date('2024-01-20T09:15:00'),
        tipo: 'entrada',
        validado: false,
        observacoes: 'Acesso via aplicativo móvel'
      },
      {
        id: 3,
        usuarioId: 1,
        nomeUsuario: 'João Silva',
        academiaId: 1,
        nomeAcademia: 'Academia Central',
        dataHora: new Date('2024-01-20T10:45:00'),
        tipo: 'saida',
        equipamentoId: 1,
        nomeEquipamento: 'Catraca Principal',
        validado: true
      }
    ];
    
    this.acessosFiltrados = [...this.acessos];
  }

  carregarEstatisticas(): void {
    // TODO: Implementar chamada para API
    // this.acessoService.obterEstatisticas().subscribe({
    //   next: (stats) => {
    //     this.estatisticas = stats;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar estatísticas:', error);
    //   }
    // });
    
    // Mock data para desenvolvimento
    this.estatisticas = {
      totalHoje: 45,
      entradas: 23,
      saidas: 22,
      naoValidados: 3
    };
  }

  aplicarFiltros(): void {
    this.acessosFiltrados = this.acessos.filter(acesso => {
      let incluir = true;
      
      if (this.filtroTipo && acesso.tipo !== this.filtroTipo) {
        incluir = false;
      }
      
      if (this.filtroValidado !== '' && acesso.validado.toString() !== this.filtroValidado) {
        incluir = false;
      }
      
      if (this.filtroData) {
        const dataAcesso = new Date(acesso.dataHora).toISOString().split('T')[0];
        if (dataAcesso !== this.filtroData) {
          incluir = false;
        }
      }
      
      if (this.filtroUsuario && !acesso.nomeUsuario.toLowerCase().includes(this.filtroUsuario.toLowerCase())) {
        incluir = false;
      }
      
      return incluir;
    });
  }

  limparFiltros(): void {
    this.filtroTipo = '';
    this.filtroValidado = '';
    this.filtroData = '';
    this.filtroUsuario = '';
    this.acessosFiltrados = [...this.acessos];
  }

  validarAcesso(id: number): void {
    if (confirm('Confirma a validação deste acesso?')) {
      // TODO: Implementar chamada para API
      // this.acessoService.validarAcesso(id).subscribe({
      //   next: () => {
      //     this.carregarAcessos();
      //   },
      //   error: (error) => {
      //     console.error('Erro ao validar acesso:', error);
      //   }
      // });
      
      // Mock para desenvolvimento
      const acesso = this.acessos.find(a => a.id === id);
      if (acesso) {
        acesso.validado = true;
        this.aplicarFiltros();
      }
    }
  }
}