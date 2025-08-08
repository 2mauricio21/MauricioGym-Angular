import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AcessoService } from '../../../core/services/acesso.service';

interface MeuAcessoDetalhado {
  id: number;
  dataHora: Date;
  tipo: 'entrada' | 'saida';
  academia: {
    id: number;
    nome: string;
    endereco: string;
  };
  equipamento?: {
    id: number;
    nome: string;
    localizacao: string;
  };
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
  observacoes?: string;
  ipOrigem?: string;
  dispositivoId?: string;
  validado: boolean;
  validadoPor?: string;
  dataValidacao?: Date;
}

@Component({
  selector: 'app-meus-acessos-detail',
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
            <h1 class="text-2xl font-bold">Detalhes do Acesso</h1>
          </div>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-500">Carregando...</p>
        </div>

        <div *ngIf="!loading && acesso" class="bg-white shadow-md rounded-lg overflow-hidden">
          <!-- Status Badge -->
          <div class="bg-gray-50 px-6 py-4 border-b">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                    [class]="acesso.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ acesso.tipo === 'entrada' ? 'Entrada' : 'Saída' }}
              </span>
              <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                    [class]="acesso.validado ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'">
                {{ acesso.validado ? 'Validado' : 'Pendente' }}
              </span>
            </div>
          </div>

          <!-- Informações Principais -->
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Informações do Acesso</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Data e Hora</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.dataHora | date:'dd/MM/yyyy HH:mm:ss' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Tipo de Acesso</label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ acesso.tipo === 'entrada' ? 'Entrada na Academia' : 'Saída da Academia' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Informações da Academia -->
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Academia</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Nome</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.academia.nome }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Endereço</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.academia.endereco }}</p>
              </div>
            </div>
          </div>

          <!-- Informações do Equipamento -->
          <div *ngIf="acesso.equipamento" class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Equipamento</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Nome</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.equipamento.nome }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Localização</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.equipamento.localizacao }}</p>
              </div>
            </div>
          </div>

          <!-- Informações Técnicas -->
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Informações Técnicas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div *ngIf="acesso.ipOrigem">
                <label class="block text-sm font-medium text-gray-500">IP de Origem</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ acesso.ipOrigem }}</p>
              </div>
              <div *ngIf="acesso.dispositivoId">
                <label class="block text-sm font-medium text-gray-500">ID do Dispositivo</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ acesso.dispositivoId }}</p>
              </div>
            </div>
          </div>

          <!-- Validação -->
          <div *ngIf="acesso.validado" class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Validação</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Validado por</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.validadoPor || 'Sistema Automático' }}</p>
              </div>
              <div *ngIf="acesso.dataValidacao">
                <label class="block text-sm font-medium text-gray-500">Data de Validação</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.dataValidacao | date:'dd/MM/yyyy HH:mm:ss' }}</p>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div *ngIf="acesso.observacoes" class="px-6 py-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Observações</h3>
            <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ acesso.observacoes }}</p>
          </div>
        </div>

        <div *ngIf="!loading && !acesso" class="text-center py-8">
          <p class="text-gray-500">Acesso não encontrado.</p>
        </div>

        <!-- Timeline de Acessos Relacionados -->
        <div *ngIf="!loading && acesso" class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Acessos do Mesmo Dia</h3>
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4">
              <div class="space-y-3">
                <div *ngFor="let acessoRelacionado of acessosRelacionados" 
                     class="flex items-center space-x-3 p-3 rounded-lg"
                     [class]="acessoRelacionado.id === acesso.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'">
                  <div class="flex-shrink-0">
                    <span class="w-3 h-3 rounded-full inline-block"
                          [class]="acessoRelacionado.tipo === 'entrada' ? 'bg-green-500' : 'bg-red-500'">
                    </span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-900">
                        {{ acessoRelacionado.dataHora | date:'HH:mm:ss' }} - 
                        {{ acessoRelacionado.tipo === 'entrada' ? 'Entrada' : 'Saída' }}
                      </span>
                      <span *ngIf="acessoRelacionado.id === acesso.id" 
                            class="text-xs text-blue-600 font-medium">
                        Atual
                      </span>
                    </div>
                    <p class="text-xs text-gray-500">{{ acessoRelacionado.academia.nome }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MeusAcessosDetailComponent implements OnInit {
  acesso: MeuAcessoDetalhado | null = null;
  acessosRelacionados: any[] = [];
  loading = false;
  acessoId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private acessoService: AcessoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.acessoId = +id;
      this.carregarAcesso();
    }
  }

  carregarAcesso(): void {
    this.loading = true;
    
    // TODO: Implementar chamada para API
    // this.acessoService.obterPorId(this.acessoId).subscribe({
    //   next: (acesso) => {
    //     this.acesso = acesso;
    //     this.carregarAcessosRelacionados();
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar acesso:', error);
    //     this.loading = false;
    //   }
    // });
    
    // Mock data para desenvolvimento
    setTimeout(() => {
      this.acesso = {
        id: this.acessoId,
        dataHora: new Date('2024-01-20T08:30:00'),
        tipo: 'entrada',
        academia: {
          id: 1,
          nome: 'Academia Central',
          endereco: 'Rua das Flores, 123 - Centro'
        },
        equipamento: {
          id: 1,
          nome: 'Catraca Principal',
          localizacao: 'Entrada Principal'
        },
        usuario: {
          id: 1,
          nome: 'João Silva',
          email: 'joao@email.com'
        },
        observacoes: 'Acesso normal durante horário de funcionamento.',
        ipOrigem: '192.168.1.100',
        dispositivoId: 'CATR-001',
        validado: true,
        validadoPor: 'Sistema Automático',
        dataValidacao: new Date('2024-01-20T08:30:05')
      };
      
      this.carregarAcessosRelacionados();
      this.loading = false;
    }, 500);
  }

  carregarAcessosRelacionados(): void {
    if (!this.acesso) return;
    
    // Mock data para acessos do mesmo dia
    const dataAcesso = this.acesso.dataHora;
    this.acessosRelacionados = [
      {
        id: this.acessoId,
        dataHora: dataAcesso,
        tipo: this.acesso.tipo,
        academia: this.acesso.academia
      },
      {
        id: this.acessoId + 1,
        dataHora: new Date(dataAcesso.getTime() + 2 * 60 * 60 * 1000), // 2 horas depois
        tipo: 'saida',
        academia: this.acesso.academia
      }
    ].sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime());
  }

  voltar(): void {
    this.router.navigate(['/meus-acessos']);
  }
}