import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PagamentoService } from '../../../core/services/pagamento.service';

interface PagamentoDetalhado {
  id: number;
  dataVencimento: Date;
  dataPagamento?: Date;
  valor: number;
  valorOriginal: number;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado';
  plano: {
    id: number;
    nome: string;
    tipo: string;
    descricao: string;
    valorMensal: number;
  };
  usuario: {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
  };
  metodoPagamento?: string;
  numeroTransacao?: string;
  observacoes?: string;
  multa?: number;
  desconto?: number;
  juros?: number;
  dataVencimentoOriginal: Date;
  dataCriacao: Date;
  dataAtualizacao?: Date;
  criadoPor: string;
  atualizadoPor?: string;
  comprovante?: {
    url: string;
    tipo: string;
    tamanho: number;
  };
}

@Component({
  selector: 'app-pagamento-detail',
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
            <h1 class="text-2xl font-bold">Detalhes do Pagamento #{{ pagamento?.id }}</h1>
          </div>
          <div class="flex space-x-2">
            <button 
              [routerLink]="['/pagamentos', pagamento?.id, 'editar']"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Editar
            </button>
            <button 
              *ngIf="pagamento?.status === 'pendente'"
              (click)="confirmarPagamento()"
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Confirmar Pagamento
            </button>
            <button 
              *ngIf="pagamento?.comprovante"
              (click)="baixarComprovante()"
              class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
              Baixar Comprovante
            </button>
          </div>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-500">Carregando...</p>
        </div>

        <div *ngIf="!loading && pagamento" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Coluna Principal -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Status e Valor -->
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="bg-gray-50 px-6 py-4 border-b">
                <div class="flex items-center justify-between">
                  <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                        [ngClass]="getStatusClass(pagamento.status)">
                    {{ getStatusText(pagamento.status) }}
                  </span>
                  <div class="text-right">
                    <p class="text-3xl font-bold text-gray-900">{{ getValorFinal() | currency:'BRL':'symbol':'1.2-2' }}</p>
                    <p class="text-sm text-gray-500">Valor Total</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informações do Pagamento -->
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b">
                <h3 class="text-lg font-semibold text-gray-900">Informações do Pagamento</h3>
              </div>
              <div class="px-6 py-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Data de Vencimento</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.dataVencimento | date:'dd/MM/yyyy' }}</p>
                    <p *ngIf="isVencido()" class="text-xs text-red-600">
                      Vencido há {{ getDiasVencido() }} dias
                    </p>
                  </div>
                  <div *ngIf="pagamento.dataPagamento">
                    <label class="block text-sm font-medium text-gray-500">Data de Pagamento</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.dataPagamento | date:'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Valor Original</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.valorOriginal | currency:'BRL':'symbol':'1.2-2' }}</p>
                  </div>
                  <div *ngIf="pagamento.metodoPagamento">
                    <label class="block text-sm font-medium text-gray-500">Método de Pagamento</label>
                    <p class="mt-1 text-sm text-gray-900">{{ getMetodoPagamentoTexto(pagamento.metodoPagamento) }}</p>
                  </div>
                  <div *ngIf="pagamento.numeroTransacao">
                    <label class="block text-sm font-medium text-gray-500">Número da Transação</label>
                    <p class="mt-1 text-sm text-gray-900 font-mono">{{ pagamento.numeroTransacao }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detalhamento de Valores -->
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b">
                <h3 class="text-lg font-semibold text-gray-900">Detalhamento de Valores</h3>
              </div>
              <div class="px-6 py-4">
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Valor do Plano</span>
                    <span class="text-sm font-medium text-gray-900">{{ pagamento.valorOriginal | currency:'BRL':'symbol':'1.2-2' }}</span>
                  </div>
                  <div *ngIf="pagamento.desconto" class="flex justify-between items-center">
                    <span class="text-sm text-green-600">Desconto</span>
                    <span class="text-sm font-medium text-green-600">- {{ pagamento.desconto | currency:'BRL':'symbol':'1.2-2' }}</span>
                  </div>
                  <div *ngIf="pagamento.multa" class="flex justify-between items-center">
                    <span class="text-sm text-red-600">Multa por Atraso</span>
                    <span class="text-sm font-medium text-red-600">+ {{ pagamento.multa | currency:'BRL':'symbol':'1.2-2' }}</span>
                  </div>
                  <div *ngIf="pagamento.juros" class="flex justify-between items-center">
                    <span class="text-sm text-red-600">Juros</span>
                    <span class="text-sm font-medium text-red-600">+ {{ pagamento.juros | currency:'BRL':'symbol':'1.2-2' }}</span>
                  </div>
                  <hr class="my-3">
                  <div class="flex justify-between items-center">
                    <span class="text-base font-semibold text-gray-900">Total</span>
                    <span class="text-base font-bold text-gray-900">{{ getValorFinal() | currency:'BRL':'symbol':'1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informações do Plano -->
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b">
                <h3 class="text-lg font-semibold text-gray-900">Plano Contratado</h3>
              </div>
              <div class="px-6 py-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Nome do Plano</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.plano.nome }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Tipo</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.plano.tipo }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Valor Mensal</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.plano.valorMensal | currency:'BRL':'symbol':'1.2-2' }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-500">Descrição</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.plano.descricao }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Observações -->
            <div *ngIf="pagamento.observacoes" class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b">
                <h3 class="text-lg font-semibold text-gray-900">Observações</h3>
              </div>
              <div class="px-6 py-4">
                <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ pagamento.observacoes }}</p>
              </div>
            </div>
          </div>

          <!-- Coluna Lateral -->
          <div class="space-y-6">
            <!-- Informações do Cliente -->
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b">
                <h3 class="text-lg font-semibold text-gray-900">Cliente</h3>
              </div>
              <div class="px-6 py-4">
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Nome</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.usuario.nome }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Email</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.usuario.email }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">CPF</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.usuario.cpf }}</p>
                  </div>
                  <div *ngIf="pagamento.usuario.telefone">
                    <label class="block text-sm font-medium text-gray-500">Telefone</label>
                    <p class="mt-1 text-sm text-gray-900">{{ pagamento.usuario.telefone }}</p>
                  </div>
                  <div class="pt-2">
                    <button 
                      [routerLink]="['/usuarios', pagamento.usuario.id]"
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Ver Perfil Completo →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Comprovante -->
            <div *ngIf="pagamento.comprovante" class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b">
                <h3 class="text-lg font-semibold text-gray-900">Comprovante</h3>
              </div>
              <div class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span class="text-blue-600 font-semibold text-xs">{{ pagamento.comprovante.tipo }}</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">Comprovante de Pagamento</p>
                    <p class="text-xs text-gray-500">{{ formatarTamanhoArquivo(pagamento.comprovante.tamanho) }}</p>
                  </div>
                </div>
                <button 
                  (click)="baixarComprovante()"
                  class="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                  Baixar Comprovante
                </button>
              </div>
            </div>

            <!-- Histórico de Auditoria -->
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b">
                <h3 class="text-lg font-semibold text-gray-900">Auditoria</h3>
              </div>
              <div class="px-6 py-4">
                <div class="space-y-4">
                  <div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">Pagamento criado</p>
                      <p class="text-xs text-gray-500">{{ pagamento.dataCriacao | date:'dd/MM/yyyy HH:mm' }}</p>
                      <p class="text-xs text-gray-500">por {{ pagamento.criadoPor }}</p>
                    </div>
                  </div>
                  <div *ngIf="pagamento.dataAtualizacao" class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">Última atualização</p>
                      <p class="text-xs text-gray-500">{{ pagamento.dataAtualizacao | date:'dd/MM/yyyy HH:mm' }}</p>
                      <p class="text-xs text-gray-500">por {{ pagamento.atualizadoPor || 'Sistema' }}</p>
                    </div>
                  </div>
                  <div *ngIf="pagamento.dataPagamento" class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">Pagamento confirmado</p>
                      <p class="text-xs text-gray-500">{{ pagamento.dataPagamento | date:'dd/MM/yyyy HH:mm' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && !pagamento" class="text-center py-8">
          <p class="text-gray-500">Pagamento não encontrado.</p>
        </div>
      </div>
    </div>
  `
})
export class PagamentoDetailComponent implements OnInit {
  pagamento: PagamentoDetalhado | null = null;
  loading = false;
  pagamentoId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pagamentoService: PagamentoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pagamentoId = +id;
      this.carregarPagamento();
    }
  }

  carregarPagamento(): void {
    this.loading = true;
    
    // TODO: Implementar chamada para API
    // this.pagamentoService.obterPorId(this.pagamentoId).subscribe({
    //   next: (pagamento) => {
    //     this.pagamento = pagamento;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar pagamento:', error);
    //     this.loading = false;
    //   }
    // });
    
    // Mock data para desenvolvimento
    setTimeout(() => {
      this.pagamento = {
        id: this.pagamentoId,
        dataVencimento: new Date('2024-01-25'),
        dataPagamento: this.pagamentoId === 1 ? new Date('2024-01-24T14:30:00') : undefined,
        valor: 89.90,
        valorOriginal: 89.90,
        status: this.pagamentoId === 1 ? 'pago' : 'pendente',
        plano: {
          id: 1,
          nome: 'Plano Mensal Premium',
          tipo: 'Musculação + Cardio',
          descricao: 'Acesso completo à academia com musculação, cardio e aulas em grupo.',
          valorMensal: 89.90
        },
        usuario: {
          id: 1,
          nome: 'João Silva',
          email: 'joao@email.com',
          cpf: '123.456.789-00',
          telefone: '(11) 99999-9999'
        },
        metodoPagamento: this.pagamentoId === 1 ? 'cartao_credito' : undefined,
        numeroTransacao: this.pagamentoId === 1 ? 'TXN123456789' : undefined,
        observacoes: this.pagamentoId === 1 ? 'Pagamento processado automaticamente via cartão de crédito.' : 'Aguardando confirmação do pagamento.',
        desconto: this.pagamentoId === 1 ? 10.00 : undefined,
        dataVencimentoOriginal: new Date('2024-01-25'),
        dataCriacao: new Date('2024-01-01T10:00:00'),
        dataAtualizacao: this.pagamentoId === 1 ? new Date('2024-01-24T14:30:00') : undefined,
        criadoPor: 'Admin Sistema',
        atualizadoPor: this.pagamentoId === 1 ? 'Sistema Automático' : undefined,
        comprovante: this.pagamentoId === 1 ? {
          url: '/api/comprovantes/123456789.pdf',
          tipo: 'PDF',
          tamanho: 245760 // 240KB
        } : undefined
      };
      
      this.loading = false;
    }, 500);
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

  getMetodoPagamentoTexto(metodo: string): string {
    switch (metodo) {
      case 'dinheiro': return 'Dinheiro';
      case 'cartao_credito': return 'Cartão de Crédito';
      case 'cartao_debito': return 'Cartão de Débito';
      case 'pix': return 'PIX';
      case 'transferencia': return 'Transferência Bancária';
      case 'boleto': return 'Boleto';
      default: return metodo;
    }
  }

  getValorFinal(): number {
    if (!this.pagamento) return 0;
    
    let valor = this.pagamento.valor;
    if (this.pagamento.multa) valor += this.pagamento.multa;
    if (this.pagamento.juros) valor += this.pagamento.juros;
    if (this.pagamento.desconto) valor -= this.pagamento.desconto;
    
    return valor;
  }

  isVencido(): boolean {
    if (!this.pagamento || this.pagamento.status === 'pago') return false;
    return new Date() > this.pagamento.dataVencimento;
  }

  getDiasVencido(): number {
    if (!this.pagamento || !this.isVencido()) return 0;
    
    const hoje = new Date();
    const vencimento = this.pagamento.dataVencimento;
    const diffTime = hoje.getTime() - vencimento.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatarTamanhoArquivo(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  confirmarPagamento(): void {
    if (confirm('Confirmar o pagamento deste valor?')) {
      // TODO: Implementar confirmação de pagamento
      alert('Funcionalidade de confirmação de pagamento será implementada.');
    }
  }

  baixarComprovante(): void {
    if (this.pagamento?.comprovante) {
      // TODO: Implementar download do comprovante
      window.open(this.pagamento.comprovante.url, '_blank');
    }
  }

  voltar(): void {
    this.router.navigate(['/pagamentos']);
  }
}