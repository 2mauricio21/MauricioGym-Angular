import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AcessoService } from '../../../core/services/acesso.service';

interface MeuAcesso {
  id: number;
  dataHora: Date;
  tipo: 'entrada' | 'saida';
  academia: string;
  equipamento?: string;
  observacoes?: string;
}

@Component({
  selector: 'app-meus-acessos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Meus Acessos</h1>
        <div class="flex space-x-2">
          <select class="px-3 py-2 border border-gray-300 rounded-md" [(ngModel)]="filtroTipo">
            <option value="">Todos os tipos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
          </select>
          <input 
            type="date" 
            class="px-3 py-2 border border-gray-300 rounded-md"
            [(ngModel)]="filtroData"
            placeholder="Filtrar por data">
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <p class="text-gray-500">Carregando acessos...</p>
      </div>

      <div *ngIf="!loading" class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academia
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipamento
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let acesso of acessosFiltrados" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ acesso.dataHora | date:'dd/MM/yyyy HH:mm' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [class]="acesso.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ acesso.tipo === 'entrada' ? 'Entrada' : 'Saída' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ acesso.academia }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ acesso.equipamento || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    [routerLink]="['/meus-acessos', acesso.id]"
                    class="text-blue-600 hover:text-blue-900 mr-3">
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="acessosFiltrados.length === 0" class="text-center py-8">
          <p class="text-gray-500">Nenhum acesso encontrado.</p>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">T</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total de Acessos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estatisticas.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">E</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Entradas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estatisticas.entradas }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">S</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Saídas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estatisticas.saidas }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">M</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Este Mês</p>
              <p class="text-2xl font-semibold text-gray-900">{{ estatisticas.esteMes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MeusAcessosListComponent implements OnInit {
  acessos: MeuAcesso[] = [];
  acessosFiltrados: MeuAcesso[] = [];
  loading = false;
  filtroTipo = '';
  filtroData = '';
  
  estatisticas = {
    total: 0,
    entradas: 0,
    saidas: 0,
    esteMes: 0
  };

  constructor(private acessoService: AcessoService) {}

  ngOnInit(): void {
    this.carregarAcessos();
  }

  carregarAcessos(): void {
    this.loading = true;
    
    // TODO: Implementar chamada para API
    // this.acessoService.obterMeusAcessos().subscribe({
    //   next: (acessos) => {
    //     this.acessos = acessos;
    //     this.aplicarFiltros();
    //     this.calcularEstatisticas();
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar acessos:', error);
    //     this.loading = false;
    //   }
    // });
    
    // Mock data para desenvolvimento
    setTimeout(() => {
      this.acessos = [
        {
          id: 1,
          dataHora: new Date('2024-01-20T08:30:00'),
          tipo: 'entrada',
          academia: 'Academia Central',
          equipamento: 'Catraca Principal'
        },
        {
          id: 2,
          dataHora: new Date('2024-01-20T10:45:00'),
          tipo: 'saida',
          academia: 'Academia Central',
          equipamento: 'Catraca Principal'
        },
        {
          id: 3,
          dataHora: new Date('2024-01-19T07:15:00'),
          tipo: 'entrada',
          academia: 'Academia Filial Norte',
          equipamento: 'Catraca Secundária'
        },
        {
          id: 4,
          dataHora: new Date('2024-01-19T09:30:00'),
          tipo: 'saida',
          academia: 'Academia Filial Norte',
          equipamento: 'Catraca Secundária'
        },
        {
          id: 5,
          dataHora: new Date('2024-01-18T18:00:00'),
          tipo: 'entrada',
          academia: 'Academia Central',
          equipamento: 'Catraca Principal'
        }
      ];
      
      this.aplicarFiltros();
      this.calcularEstatisticas();
      this.loading = false;
    }, 500);
  }

  aplicarFiltros(): void {
    this.acessosFiltrados = this.acessos.filter(acesso => {
      const matchTipo = !this.filtroTipo || acesso.tipo === this.filtroTipo;
      const matchData = !this.filtroData || 
        acesso.dataHora.toISOString().split('T')[0] === this.filtroData;
      
      return matchTipo && matchData;
    });
  }

  calcularEstatisticas(): void {
    this.estatisticas.total = this.acessos.length;
    this.estatisticas.entradas = this.acessos.filter(a => a.tipo === 'entrada').length;
    this.estatisticas.saidas = this.acessos.filter(a => a.tipo === 'saida').length;
    
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    this.estatisticas.esteMes = this.acessos.filter(a => a.dataHora >= inicioMes).length;
  }
}