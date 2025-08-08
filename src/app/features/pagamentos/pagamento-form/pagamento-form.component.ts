import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PagamentoService } from '../../../core/services/pagamento.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { PlanoService } from '../../../core/services/plano.service';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

interface Plano {
  id: number;
  nome: string;
  valor: number;
  tipo: string;
}

@Component({
  selector: 'app-pagamento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
            <h1 class="text-2xl font-bold">
              {{ isEdicao ? 'Editar Pagamento' : 'Novo Pagamento' }}
            </h1>
          </div>
        </div>

        <form [formGroup]="pagamentoForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Informações do Usuário -->
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Usuário</h3>
            </div>
            <div class="px-6 py-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="usuarioId" class="block text-sm font-medium text-gray-700 mb-1">
                    Usuário *
                  </label>
                  <select 
                    id="usuarioId"
                    formControlName="usuarioId"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [class.border-red-500]="pagamentoForm.get('usuarioId')?.invalid && pagamentoForm.get('usuarioId')?.touched">
                    <option value="">Selecione um usuário</option>
                    <option *ngFor="let usuario of usuarios" [value]="usuario.id">
                      {{ usuario.nome }} - {{ usuario.email }}
                    </option>
                  </select>
                  <div *ngIf="pagamentoForm.get('usuarioId')?.invalid && pagamentoForm.get('usuarioId')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    Usuário é obrigatório
                  </div>
                </div>
                <div>
                  <label for="planoId" class="block text-sm font-medium text-gray-700 mb-1">
                    Plano *
                  </label>
                  <select 
                    id="planoId"
                    formControlName="planoId"
                    (change)="onPlanoChange()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [class.border-red-500]="pagamentoForm.get('planoId')?.invalid && pagamentoForm.get('planoId')?.touched">
                    <option value="">Selecione um plano</option>
                    <option *ngFor="let plano of planos" [value]="plano.id">
                      {{ plano.nome }} - {{ plano.valor | currency:'BRL':'symbol':'1.2-2' }}
                    </option>
                  </select>
                  <div *ngIf="pagamentoForm.get('planoId')?.invalid && pagamentoForm.get('planoId')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    Plano é obrigatório
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Informações do Pagamento -->
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Dados do Pagamento</h3>
            </div>
            <div class="px-6 py-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="dataVencimento" class="block text-sm font-medium text-gray-700 mb-1">
                    Data de Vencimento *
                  </label>
                  <input 
                    type="date"
                    id="dataVencimento"
                    formControlName="dataVencimento"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [class.border-red-500]="pagamentoForm.get('dataVencimento')?.invalid && pagamentoForm.get('dataVencimento')?.touched">
                  <div *ngIf="pagamentoForm.get('dataVencimento')?.invalid && pagamentoForm.get('dataVencimento')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    Data de vencimento é obrigatória
                  </div>
                </div>
                <div>
                  <label for="valor" class="block text-sm font-medium text-gray-700 mb-1">
                    Valor *
                  </label>
                  <input 
                    type="number"
                    id="valor"
                    formControlName="valor"
                    step="0.01"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [class.border-red-500]="pagamentoForm.get('valor')?.invalid && pagamentoForm.get('valor')?.touched">
                  <div *ngIf="pagamentoForm.get('valor')?.invalid && pagamentoForm.get('valor')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    <span *ngIf="pagamentoForm.get('valor')?.errors?.['required']">Valor é obrigatório</span>
                    <span *ngIf="pagamentoForm.get('valor')?.errors?.['min']">Valor deve ser maior que zero</span>
                  </div>
                </div>
                <div>
                  <label for="desconto" class="block text-sm font-medium text-gray-700 mb-1">
                    Desconto
                  </label>
                  <input 
                    type="number"
                    id="desconto"
                    formControlName="desconto"
                    step="0.01"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label for="multa" class="block text-sm font-medium text-gray-700 mb-1">
                    Multa
                  </label>
                  <input 
                    type="number"
                    id="multa"
                    formControlName="multa"
                    step="0.01"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
            </div>
          </div>

          <!-- Status e Pagamento -->
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Status e Confirmação</h3>
            </div>
            <div class="px-6 py-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select 
                    id="status"
                    formControlName="status"
                    (change)="onStatusChange()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [class.border-red-500]="pagamentoForm.get('status')?.invalid && pagamentoForm.get('status')?.touched">
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="vencido">Vencido</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div *ngIf="mostrarCamposPagamento">
                  <label for="dataPagamento" class="block text-sm font-medium text-gray-700 mb-1">
                    Data de Pagamento
                  </label>
                  <input 
                    type="datetime-local"
                    id="dataPagamento"
                    formControlName="dataPagamento"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div *ngIf="mostrarCamposPagamento">
                  <label for="metodoPagamento" class="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pagamento
                  </label>
                  <select 
                    id="metodoPagamento"
                    formControlName="metodoPagamento"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione o método</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                    <option value="transferencia">Transferência Bancária</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>
                <div *ngIf="mostrarCamposPagamento">
                  <label for="numeroTransacao" class="block text-sm font-medium text-gray-700 mb-1">
                    Número da Transação
                  </label>
                  <input 
                    type="text"
                    id="numeroTransacao"
                    formControlName="numeroTransacao"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Observações</h3>
            </div>
            <div class="px-6 py-4">
              <textarea 
                formControlName="observacoes"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações adicionais sobre o pagamento..."></textarea>
            </div>
          </div>

          <!-- Resumo de Valores -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-blue-900 mb-4">Resumo de Valores</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-blue-700">Valor Base:</span>
                <span class="font-medium text-blue-900">{{ getValorBase() | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <div *ngIf="getDesconto() > 0" class="flex justify-between">
                <span class="text-green-700">Desconto:</span>
                <span class="font-medium text-green-800">- {{ getDesconto() | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <div *ngIf="getMulta() > 0" class="flex justify-between">
                <span class="text-red-700">Multa:</span>
                <span class="font-medium text-red-800">+ {{ getMulta() | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <hr class="border-blue-300">
              <div class="flex justify-between text-lg">
                <span class="font-semibold text-blue-900">Total:</span>
                <span class="font-bold text-blue-900">{{ getValorTotal() | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              (click)="voltar()"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Cancelar
            </button>
            <button 
              type="submit"
              [disabled]="pagamentoForm.invalid || salvando"
              class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ salvando ? 'Salvando...' : (isEdicao ? 'Atualizar' : 'Criar') }} Pagamento
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PagamentoFormComponent implements OnInit {
  pagamentoForm!: FormGroup;
  usuarios: Usuario[] = [];
  planos: Plano[] = [];
  isEdicao = false;
  pagamentoId?: number;
  salvando = false;
  mostrarCamposPagamento = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pagamentoService: PagamentoService,
    private usuarioService: UsuarioService,
    private planoService: PlanoService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      this.pagamentoId = +id;
    }

    this.carregarDados();
    
    if (this.isEdicao && this.pagamentoId) {
      this.carregarPagamento();
    }
  }

  initForm(): void {
    this.pagamentoForm = this.fb.group({
      usuarioId: ['', Validators.required],
      planoId: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      desconto: [0],
      multa: [0],
      status: ['pendente', Validators.required],
      dataPagamento: [''],
      metodoPagamento: [''],
      numeroTransacao: [''],
      observacoes: ['']
    });
  }

  carregarDados(): void {
    // TODO: Implementar chamadas para API
    // this.usuarioService.listar().subscribe(usuarios => this.usuarios = usuarios);
    // this.planoService.listar().subscribe(planos => this.planos = planos);
    
    // Mock data para desenvolvimento
    this.usuarios = [
      { id: 1, nome: 'João Silva', email: 'joao@email.com', cpf: '123.456.789-00' },
      { id: 2, nome: 'Maria Santos', email: 'maria@email.com', cpf: '987.654.321-00' },
      { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', cpf: '456.789.123-00' }
    ];
    
    this.planos = [
      { id: 1, nome: 'Plano Mensal', valor: 89.90, tipo: 'Musculação' },
      { id: 2, nome: 'Plano Trimestral', valor: 249.90, tipo: 'Musculação + Cardio' },
      { id: 3, nome: 'Plano Anual', valor: 899.90, tipo: 'Completo' }
    ];
  }

  carregarPagamento(): void {
    if (!this.pagamentoId) return;
    
    // TODO: Implementar chamada para API
    // this.pagamentoService.obterPorId(this.pagamentoId).subscribe({
    //   next: (pagamento) => {
    //     this.pagamentoForm.patchValue(pagamento);
    //     this.onStatusChange();
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar pagamento:', error);
    //   }
    // });
    
    // Mock data para desenvolvimento
    const mockPagamento = {
      usuarioId: 1,
      planoId: 1,
      dataVencimento: '2024-01-25',
      valor: 89.90,
      desconto: 0,
      multa: 0,
      status: 'pendente',
      observacoes: 'Pagamento de teste'
    };
    
    this.pagamentoForm.patchValue(mockPagamento);
    this.onStatusChange();
  }

  onPlanoChange(): void {
    const planoId = this.pagamentoForm.get('planoId')?.value;
    if (planoId) {
      const plano = this.planos.find(p => p.id == planoId);
      if (plano) {
        this.pagamentoForm.patchValue({ valor: plano.valor });
      }
    }
  }

  onStatusChange(): void {
    const status = this.pagamentoForm.get('status')?.value;
    this.mostrarCamposPagamento = status === 'pago';
    
    if (status === 'pago' && !this.pagamentoForm.get('dataPagamento')?.value) {
      const agora = new Date();
      const dataFormatada = agora.toISOString().slice(0, 16);
      this.pagamentoForm.patchValue({ dataPagamento: dataFormatada });
    }
  }

  getValorBase(): number {
    return this.pagamentoForm.get('valor')?.value || 0;
  }

  getDesconto(): number {
    return this.pagamentoForm.get('desconto')?.value || 0;
  }

  getMulta(): number {
    return this.pagamentoForm.get('multa')?.value || 0;
  }

  getValorTotal(): number {
    return this.getValorBase() + this.getMulta() - this.getDesconto();
  }

  onSubmit(): void {
    if (this.pagamentoForm.valid) {
      this.salvando = true;
      
      const formData = this.pagamentoForm.value;
      
      // TODO: Implementar chamada para API
      // const request = this.isEdicao 
      //   ? this.pagamentoService.atualizar(this.pagamentoId!, formData)
      //   : this.pagamentoService.criar(formData);
      
      // request.subscribe({
      //   next: () => {
      //     this.router.navigate(['/pagamentos']);
      //   },
      //   error: (error) => {
      //     console.error('Erro ao salvar pagamento:', error);
      //     this.salvando = false;
      //   }
      // });
      
      // Mock para desenvolvimento
      setTimeout(() => {
        console.log('Pagamento salvo:', formData);
        this.router.navigate(['/pagamentos']);
      }, 1000);
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.pagamentoForm.controls).forEach(key => {
        this.pagamentoForm.get(key)?.markAsTouched();
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/pagamentos']);
  }
}