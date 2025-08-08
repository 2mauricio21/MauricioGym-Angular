import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: Date;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  ativo: boolean;
  observacoes?: string;
  planoAtual?: {
    id: number;
    nome: string;
    dataInicio: Date;
    dataVencimento: Date;
    valor: number;
  };
  estatisticas: {
    totalAcessos: number;
    ultimoAcesso?: Date;
    diasAtivo: number;
    pagamentosRealizados: number;
    valorTotalPago: number;
  };
  dataCadastro: Date;
  dataAtualizacao: Date;
}

interface HistoricoAcesso {
  id: number;
  dataHora: Date;
  academia: string;
  tipo: 'entrada' | 'saida';
  equipamento?: string;
}

@Component({
  selector: 'app-usuario-detail',
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
            <h1 class="text-2xl font-bold text-gray-900">Detalhes do Usuário</h1>
          </div>
          <div class="flex space-x-3">
            <button 
              [routerLink]="['/usuarios', usuario?.id, 'editar']"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
              Editar
            </button>
            <button 
              (click)="toggleStatus()"
              [class]="usuario?.ativo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
              class="text-white px-4 py-2 rounded-lg font-medium">
              {{ usuario?.ativo ? 'Desativar' : 'Ativar' }}
            </button>
          </div>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-500">Carregando dados do usuário...</p>
        </div>

        <div *ngIf="!loading && usuario" class="space-y-6">
          <!-- Informações Básicas -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <span class="text-xl font-bold text-gray-700">{{ getInitials(usuario.nome) }}</span>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{{ usuario.nome }}</h2>
                  <p class="text-gray-600">{{ usuario.email }}</p>
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1"
                        [class]="getStatusClass(usuario.ativo)">
                    {{ usuario.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-500">Telefone</label>
                <p class="mt-1 text-sm text-gray-900">{{ usuario.telefone }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">CPF</label>
                <p class="mt-1 text-sm text-gray-900">{{ usuario.cpf }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Data de Nascimento</label>
                <p class="mt-1 text-sm text-gray-900">{{ usuario.dataNascimento | date:'dd/MM/yyyy' }}</p>
              </div>
            </div>
          </div>

          <!-- Plano Atual -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Plano Atual</h3>
            <div *ngIf="usuario.planoAtual; else semPlano">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500">Plano</label>
                  <p class="mt-1 text-sm font-semibold text-gray-900">{{ usuario.planoAtual.nome }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Data de Início</label>
                  <p class="mt-1 text-sm text-gray-900">{{ usuario.planoAtual.dataInicio | date:'dd/MM/yyyy' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Vencimento</label>
                  <p class="mt-1 text-sm text-gray-900">{{ usuario.planoAtual.dataVencimento | date:'dd/MM/yyyy' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Valor Mensal</label>
                  <p class="mt-1 text-sm font-semibold text-green-600">{{ usuario.planoAtual.valor | currency:'BRL' }}</p>
                </div>
              </div>
            </div>
            <ng-template #semPlano>
              <p class="text-gray-500 italic">Usuário não possui plano ativo</p>
            </ng-template>
          </div>

          <!-- Estatísticas -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ usuario.estatisticas.totalAcessos }}</div>
                <div class="text-sm text-gray-500">Total de Acessos</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ usuario.estatisticas.diasAtivo }}</div>
                <div class="text-sm text-gray-500">Dias Ativo</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">{{ usuario.estatisticas.pagamentosRealizados }}</div>
                <div class="text-sm text-gray-500">Pagamentos</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-600">{{ usuario.estatisticas.valorTotalPago | currency:'BRL' }}</div>
                <div class="text-sm text-gray-500">Total Pago</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-600">{{ usuario.estatisticas.ultimoAcesso | date:'dd/MM' }}</div>
                <div class="text-sm text-gray-500">Último Acesso</div>
              </div>
            </div>
          </div>

          <!-- Endereço -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">CEP</label>
                <p class="mt-1 text-sm text-gray-900">{{ usuario.endereco.cep }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500">Logradouro</label>
                <p class="mt-1 text-sm text-gray-900">{{ usuario.endereco.logradouro }}, {{ usuario.endereco.numero }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Complemento</label>
                <p class="mt-1 text-sm text-gray-900">{{ usuario.endereco.complemento || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Bairro</label>
                <p class="mt-1 text-sm text-gray-900">{{ usuario.endereco.bairro }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Cidade/Estado</label>
                <p class="mt-1 text-sm text-gray-900">{{ usuario.endereco.cidade }}/{{ usuario.endereco.estado }}</p>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div class="bg-white rounded-lg shadow p-6" *ngIf="usuario.observacoes">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
            <p class="text-sm text-gray-700">{{ usuario.observacoes }}</p>
          </div>

          <!-- Histórico de Acessos Recentes -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Acessos Recentes</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academia</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipamento</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let acesso of historicoAcessos">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ acesso.dataHora | date:'dd/MM/yyyy HH:mm' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ acesso.academia }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="acesso.tipo === 'entrada' ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' : 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'">
                        {{ acesso.tipo === 'entrada' ? 'Entrada' : 'Saída' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ acesso.equipamento || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Informações de Auditoria -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações de Auditoria</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Data de Cadastro</label>
                <p class="mt-1 text-sm text-gray-900">{{ usuario.dataCadastro | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Última Atualização</label>
                <p class="mt-1 text-sm text-gray-900">{{ usuario.dataAtualizacao | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && !usuario" class="text-center py-8">
          <p class="text-gray-500">Usuário não encontrado</p>
        </div>
      </div>
    </div>
  `
})
export class UsuarioDetailComponent implements OnInit {
  usuario: Usuario | null = null;
  historicoAcessos: HistoricoAcesso[] = [];
  loading = true;
  usuarioId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.usuarioId = Number(this.route.snapshot.params['id']);
    this.carregarUsuario();
    this.carregarHistoricoAcessos();
  }

  carregarUsuario(): void {
    // TODO: Implementar carregamento via API
    // Dados mockados para desenvolvimento
    setTimeout(() => {
      this.usuario = {
        id: this.usuarioId,
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        telefone: '(11) 99999-9999',
        cpf: '123.456.789-00',
        dataNascimento: new Date('1990-01-01'),
        endereco: {
          cep: '01234-567',
          logradouro: 'Rua das Flores',
          numero: '123',
          complemento: 'Apto 45',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP'
        },
        ativo: true,
        observacoes: 'Cliente VIP com desconto especial',
        planoAtual: {
          id: 1,
          nome: 'Premium',
          dataInicio: new Date('2024-01-01'),
          dataVencimento: new Date('2024-12-31'),
          valor: 150.00
        },
        estatisticas: {
          totalAcessos: 45,
          ultimoAcesso: new Date('2024-01-15T10:30:00'),
          diasAtivo: 120,
          pagamentosRealizados: 12,
          valorTotalPago: 1800.00
        },
        dataCadastro: new Date('2023-06-15T14:30:00'),
        dataAtualizacao: new Date('2024-01-10T09:15:00')
      };
      this.loading = false;
    }, 1000);
  }

  carregarHistoricoAcessos(): void {
    // TODO: Implementar carregamento via API
    // Dados mockados para desenvolvimento
    this.historicoAcessos = [
      {
        id: 1,
        dataHora: new Date('2024-01-15T10:30:00'),
        academia: 'Academia Centro',
        tipo: 'entrada',
        equipamento: 'Esteira 01'
      },
      {
        id: 2,
        dataHora: new Date('2024-01-15T11:45:00'),
        academia: 'Academia Centro',
        tipo: 'saida'
      },
      {
        id: 3,
        dataHora: new Date('2024-01-14T15:20:00'),
        academia: 'Academia Norte',
        tipo: 'entrada',
        equipamento: 'Bicicleta 05'
      }
    ];
  }

  getInitials(nome: string): string {
    return nome.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  }

  getStatusClass(ativo: boolean): string {
    return ativo 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  toggleStatus(): void {
    if (this.usuario) {
      // TODO: Implementar alteração de status via API
      this.usuario.ativo = !this.usuario.ativo;
      console.log(`Status do usuário alterado para: ${this.usuario.ativo ? 'Ativo' : 'Inativo'}`);
    }
  }

  voltar(): void {
    this.router.navigate(['/usuarios']);
  }
}
