import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PagamentoService } from '../../../core/services/pagamento.service';

interface MeuPagamento {
  id: number;
  dataVencimento: Date;
  dataPagamento?: Date;
  valor: number;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado';
  plano: {
    id: number;
    nome: string;
    tipo: string;
  };
  metodoPagamento?: string;
  observacoes?: string;
  multa?: number;
  desconto?: number;
}

@Component({
  selector: 'app-meus-pagamentos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Meus Pagamentos</h1>
        <div class="flex space-x-2">
          <select class="px-3 py-2 border border-gray-300 rounded-md" [(ngModel)]="filtroStatus">
            <option value="">Todos os status</option>
            <option value="pendente">Pendentes</option>
            <option value="pago">Pagos</option>
            <option value="vencido">Vencidos</option>
            <option value="cancelado">Cancelados</option>
          </select>
          <select class="px-3 py-2 border border-gray-300 rounded-md" [(ngModel)]="filtroAno">
            <option value="">Todos os anos</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <p class="text-gray-500">Carregando pagamentos...</p>
      </div>

      <div *ngIf="!loading" class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plano
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let pagamento of pagamentosFiltrados" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ pagamento.dataVencimento | date:'dd/MM/yyyy' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ pagamento.plano.nome }}</div>
                    <div class="text-sm text-gray-500">{{ pagamento.plano.tipo }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ pagamento.valor | currency:'BRL':'symbol':'1.2-2' }}
                    <div *ngIf="pagamento.multa" class="text-xs text-red-600">
                      + Multa: {{ pagamento.multa | currency:'BRL':'symbol':'1.2-2' }}
                    </div>
                    <div *ngIf="pagamento.desconto" class="text-xs text-green-600">
                      - Desconto: {{ pagamento.desconto | currency:'BRL':'symbol':'1.2-2' }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [ngClass]="getStatusClass(pagamento.status)">
                    {{ getStatusText(pagamento.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div *ngIf="pagamento.dataPagamento">
                    {{ pagamento.dataPagamento | date:'dd/MM/yyyy' }}
                    <div class="text-xs">{{ pagamento.metodoPagamento }}</div>
                  </div>
                  <span *ngIf="!pagamento.dataPagamento" class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    [routerLink]="['/meus-pagamentos', pagamento.id]"
                    class="text-blue-600 hover:text-blue-900 mr-3">
                    Ver Detalhes
                  </button>
                  <button 
                    *ngIf="pagamento.status === 'pendente'"
                    (click)="pagarAgora(pagamento)"
                    class="text-green-600 hover:text-green-900">
                    Pagar Agora
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="pagamentosFiltrados.length === 0" class="text-center py-8">
          <p class="text-gray-500">Nenhum pagamento encontrado.</p>
        </div>
      </div>

      <!-- Resumo Financeiro -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">T</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Pago</p>
              <p class="text-2xl font-semibold text-gray-900">{{ resumo.totalPago | currency:'BRL':'symbol':'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">P</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Pendentes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ resumo.totalPendente | currency:'BRL':'symbol':'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">V</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Vencidos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ resumo.totalVencido | currency:'BRL':'symbol':'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">M</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Este Mês</p>
              <p class="text-2xl font-semibold text-gray-900">{{ resumo.esteMes | currency:'BRL':'symbol':'1.2-2' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MeusPagamentosListComponent implements OnInit {
  pagamentos: MeuPagamento[] = [];
  pagamentosFiltrados: MeuPagamento[] = [];
  loading = false;
  filtroStatus = '';
  filtroAno = '';
  
  resumo = {
    totalPago: 0,
    totalPendente: 0,
    totalVencido: 0,
    esteMes: 0
  };

  constructor(private pagamentoService: PagamentoService) {}

  ngOnInit(): void {
    this.carregarPagamentos();
  }

  carregarPagamentos(): void {
    this.loading = true;
    
    // TODO: Implementar chamada para API
    // this.pagamentoService.obterMeusPagamentos().subscribe({
    //   next: (pagamentos) => {
    //     this.pagamentos = pagamentos;
    //     this.aplicarFiltros();
    //     this.calcularResumo();
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar pagamentos:', error);
    //     this.loading = false;
    //   }
    // });
    
    // Mock data para desenvolvimento
    setTimeout(() => {
      this.pagamentos = [
        {
          id: 1,
          dataVencimento: new Date('2024-01-25'),
          dataPagamento: new Date('2024-01-24'),
          valor: 89.90,
          status: 'pago',
          plano: {
            id: 1,
            nome: 'Plano Mensal',
            tipo: 'Musculação'
          },
          metodoPagamento: 'Cartão de Crédito'
        },
        {
          id: 2,
          dataVencimento: new Date('2024-02-25'),
          valor: 89.90,
          status: 'pendente',
          plano: {
            id: 1,
            nome: 'Plano Mensal',
            tipo: 'Musculação'
          }
        },
        {
          id: 3,
          dataVencimento: new Date('2024-01-10'),
          valor: 89.90,
          status: 'vencido',
          plano: {
            id: 1,
            nome: 'Plano Mensal',
            tipo: 'Musculação'
          },
          multa: 8.99
        },
        {
          id: 4,
          dataVencimento: new Date('2023-12-25'),
          dataPagamento: new Date('2023-12-20'),
          valor: 79.90,
          status: 'pago',
          plano: {
            id: 2,
            nome: 'Plano Promocional',
            tipo: 'Musculação'
          },
          metodoPagamento: 'PIX',
          desconto: 10.00
        }
      ];
      
      this.aplicarFiltros();
      this.calcularResumo();
      this.loading = false;
    }, 500);
  }

  aplicarFiltros(): void {
    this.pagamentosFiltrados = this.pagamentos.filter(pagamento => {
      const matchStatus = !this.filtroStatus || pagamento.status === this.filtroStatus;
      const matchAno = !this.filtroAno || 
        pagamento.dataVencimento.getFullYear().toString() === this.filtroAno;
      
      return matchStatus && matchAno;
    });
  }

  calcularResumo(): void {
    this.resumo.totalPago = this.pagamentos
      .filter(p => p.status === 'pago')
      .reduce((sum, p) => sum + p.valor + (p.multa || 0) - (p.desconto || 0), 0);
    
    this.resumo.totalPendente = this.pagamentos
      .filter(p => p.status === 'pendente')
      .reduce((sum, p) => sum + p.valor, 0);
    
    this.resumo.totalVencido = this.pagamentos
      .filter(p => p.status === 'vencido')
      .reduce((sum, p) => sum + p.valor + (p.multa || 0), 0);
    
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
    
    this.resumo.esteMes = this.pagamentos
      .filter(p => p.dataVencimento >= inicioMes && p.dataVencimento <= fimMes)
      .reduce((sum, p) => sum + p.valor + (p.multa || 0) - (p.desconto || 0), 0);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'vencido': return 'bg-red-100 text-red-800';
      case 'cancelado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pago': return 'Pago';
      case 'pendente': return 'Pendente';
      case 'vencido': return 'Vencido';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  }

  pagarAgora(pagamento: MeuPagamento): void {
    // TODO: Implementar integração com gateway de pagamento
    alert(`Redirecionando para pagamento de ${pagamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
  }
}