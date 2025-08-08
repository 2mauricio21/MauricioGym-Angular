import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meus-planos-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center mb-6">
          <button routerLink="/meus-planos" 
                  class="text-gray-600 hover:text-gray-800 mr-4">
            ← Voltar
          </button>
          <h1 class="text-3xl font-bold">Detalhes do Plano</h1>
        </div>

        <!-- Informações do Plano -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-2xl font-semibold">{{ plano?.nome }}</h2>
              <p class="text-gray-600">{{ plano?.descricao }}</p>
            </div>
            <span [class]="getStatusClass()" 
                  class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
              {{ plano?.status }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-3">Informações do Plano</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Valor:</span>
                  <span class="font-medium">R$ {{ plano?.valor }}/mês</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Data de Início:</span>
                  <span class="font-medium">{{ plano?.dataInicio | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Data de Fim:</span>
                  <span class="font-medium">{{ plano?.dataFim | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Renovação:</span>
                  <span class="font-medium">{{ plano?.renovacaoAutomatica ? 'Automática' : 'Manual' }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3">Benefícios Inclusos</h3>
              <ul class="space-y-2">
                <li *ngFor="let beneficio of plano?.beneficios" 
                    class="flex items-center text-sm">
                  <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {{ beneficio }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Histórico de Pagamentos -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h3 class="text-lg font-semibold mb-4">Histórico de Pagamentos</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let pagamento of historicoPagamentos">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ pagamento.data | date:'dd/MM/yyyy' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {{ pagamento.valor }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getPagamentoStatusClass(pagamento.status)" 
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ pagamento.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ pagamento.metodo }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Ações -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Ações Disponíveis</h3>
          <div class="flex flex-wrap gap-3">
            <button *ngIf="plano?.status === 'ativo'" 
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors">
              Pausar Plano
            </button>
            <button *ngIf="plano?.status === 'ativo'" 
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
              Cancelar Plano
            </button>
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              Alterar Forma de Pagamento
            </button>
            <button class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              Baixar Comprovantes
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MeusPlanosDetailComponent implements OnInit {
  planoId: string | null = null;
  plano: any = null;
  historicoPagamentos: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.planoId = this.route.snapshot.paramMap.get('id');
    this.loadPlano();
    this.loadHistoricoPagamentos();
  }

  loadPlano() {
    // Dados mockados para exemplo
    this.plano = {
      id: this.planoId,
      nome: 'Plano Premium',
      descricao: 'Acesso completo a todas as funcionalidades da academia',
      valor: '89,90',
      dataInicio: '2024-07-01',
      dataFim: '2024-12-31',
      status: 'ativo',
      renovacaoAutomatica: true,
      beneficios: [
        'Acesso ilimitado à academia',
        'Aulas em grupo incluídas',
        'Avaliação física mensal',
        'Acesso ao app mobile',
        'Desconto em produtos da loja',
        'Suporte prioritário'
      ]
    };
  }

  loadHistoricoPagamentos() {
    // Dados mockados para exemplo
    this.historicoPagamentos = [
      {
        data: '2024-01-01',
        valor: '89,90',
        status: 'pago',
        metodo: 'Cartão de Crédito'
      },
      {
        data: '2024-02-01',
        valor: '89,90',
        status: 'pago',
        metodo: 'Cartão de Crédito'
      },
      {
        data: '2024-03-01',
        valor: '89,90',
        status: 'pendente',
        metodo: 'Cartão de Crédito'
      }
    ];
  }

  getStatusClass(): string {
    switch (this.plano?.status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'pausado':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPagamentoStatusClass(status: string): string {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'atrasado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
