import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

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
  imports: [
    CommonModule, 
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    TableModule,
    SkeletonModule,
    AvatarModule,
    TooltipModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="container mx-auto p-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <p-button 
              (onClick)="voltar()"
              icon="pi pi-arrow-left"
              label="Voltar"
              severity="secondary"
              size="small">
            </p-button>
            <h1 class="text-2xl font-bold text-gray-900">Detalhes do Usuário</h1>
          </div>
          <div class="flex space-x-3" *ngIf="usuario">
            <p-button 
              [routerLink]="['/usuarios/editar', usuario.id]"
              icon="pi pi-pencil"
              label="Editar"
              severity="info">
            </p-button>
            <p-button 
              (onClick)="confirmarAlteracaoStatus()"
              [icon]="usuario.ativo ? 'pi pi-times' : 'pi pi-check'"
              [label]="usuario.ativo ? 'Desativar' : 'Ativar'"
              [severity]="usuario.ativo ? 'danger' : 'success'">
            </p-button>
          </div>
        </div>

        <div *ngIf="loading" class="space-y-6">
          <p-card>
            <div class="flex items-center space-x-4 mb-6">
              <p-skeleton shape="circle" size="4rem"></p-skeleton>
              <div class="space-y-2">
                <p-skeleton width="8rem" height="1rem"></p-skeleton>
                <p-skeleton width="6rem" height="0.75rem"></p-skeleton>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <p-skeleton height="1rem"></p-skeleton>
              <p-skeleton height="1rem"></p-skeleton>
              <p-skeleton height="1rem"></p-skeleton>
            </div>
          </p-card>
        </div>

        <div *ngIf="!loading && usuario" class="space-y-6">
          <!-- Informações Básicas -->
          <p-card>
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <p-avatar 
                  [label]="getInitials(usuario.nome)"
                  size="xlarge"
                  shape="circle"
                  styleClass="bg-blue-500 text-white mr-4">
                </p-avatar>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{{ usuario.nome }}</h2>
                  <p class="text-gray-600">{{ usuario.email }}</p>
                  <p-tag 
                    [value]="usuario.ativo ? 'Ativo' : 'Inativo'"
                    [severity]="usuario.ativo ? 'success' : 'danger'"
                    styleClass="mt-1">
                  </p-tag>
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
          </p-card>

          <!-- Plano Atual -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 m-0">Plano Atual</h3>
              </div>
            </ng-template>
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
                  <p class="mt-1 text-sm font-semibold text-green-600">{{ usuario.planoAtual.valor | currency:'BRL':'symbol':'1.2-2' }}</p>
                </div>
              </div>
            </div>
            <ng-template #semPlano>
              <p class="text-gray-500 italic">Usuário não possui plano ativo</p>
            </ng-template>
          </p-card>

          <!-- Estatísticas -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 m-0">Estatísticas</h3>
              </div>
            </ng-template>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div class="text-center">
                <p class="text-2xl font-bold text-blue-600">{{ usuario.estatisticas.totalAcessos }}</p>
                <p class="text-sm text-gray-500">Total de Acessos</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-green-600">{{ usuario.estatisticas.diasAtivo }}</p>
                <p class="text-sm text-gray-500">Dias Ativo</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-purple-600">{{ usuario.estatisticas.pagamentosRealizados }}</p>
                <p class="text-sm text-gray-500">Pagamentos</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-orange-600">{{ usuario.estatisticas.valorTotalPago | currency:'BRL':'symbol':'1.2-2' }}</p>
                <p class="text-sm text-gray-500">Total Pago</p>
              </div>
              <div class="text-center">
                <p class="text-sm font-medium text-gray-900">{{ usuario.estatisticas.ultimoAcesso | date:'dd/MM/yyyy HH:mm' }}</p>
                <p class="text-sm text-gray-500">Último Acesso</p>
              </div>
            </div>
          </p-card>

          <!-- Endereço -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 m-0">Endereço</h3>
              </div>
            </ng-template>
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
          </p-card>

          <!-- Observações -->
          <p-card *ngIf="usuario.observacoes">
            <ng-template pTemplate="header">
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 m-0">Observações</h3>
              </div>
            </ng-template>
            <p class="text-sm text-gray-700">{{ usuario.observacoes }}</p>
          </p-card>

          <!-- Histórico de Acessos Recentes -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 m-0">Acessos Recentes</h3>
              </div>
            </ng-template>
            <p-table 
              [value]="historicoAcessos"
              [paginator]="true"
              [rows]="5"
              [showCurrentPageReport]="true"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
              [rowsPerPageOptions]="[5, 10, 20]"
              styleClass="p-datatable-sm">
              
              <ng-template pTemplate="header">
                <tr>
                  <th>Data/Hora</th>
                  <th>Academia</th>
                  <th>Tipo</th>
                  <th>Equipamento</th>
                </tr>
              </ng-template>
              
              <ng-template pTemplate="body" let-acesso>
                <tr>
                  <td>{{ acesso.dataHora | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ acesso.academia }}</td>
                  <td>
                    <p-tag 
                      [value]="acesso.tipo === 'entrada' ? 'Entrada' : 'Saída'"
                      [severity]="acesso.tipo === 'entrada' ? 'success' : 'danger'">
                    </p-tag>
                  </td>
                  <td>{{ acesso.equipamento || '-' }}</td>
                </tr>
              </ng-template>
              
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="4" class="text-center py-4">
                    <p class="text-gray-500">Nenhum acesso encontrado</p>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>

          <!-- Informações de Auditoria -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 m-0">Informações de Auditoria</h3>
              </div>
            </ng-template>
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
          </p-card>
        </div>

        <div *ngIf="!loading && !usuario" class="text-center py-8">
          <p class="text-gray-500">Usuário não encontrado</p>
        </div>
      </div>
    </div>
    
    <!-- Toast e ConfirmDialog -->
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `
})
export class UsuarioDetailComponent implements OnInit {
  usuario: Usuario | null = null;
  historicoAcessos: HistoricoAcesso[] = [];
  loading = true;
  usuarioId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  confirmarAlteracaoStatus(): void {
    if (!this.usuario) return;

    const novoStatus = !this.usuario.ativo;
    const acao = novoStatus ? 'ativar' : 'desativar';
    
    this.confirmationService.confirm({
      message: `Tem certeza que deseja ${acao} este usuário?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.toggleStatus();
      }
    });
  }

  toggleStatus(): void {
    if (this.usuario) {
      const statusAnterior = this.usuario.ativo;
      this.usuario.ativo = !this.usuario.ativo;
      
      // TODO: Implementar alteração de status via API
      // Simulando sucesso
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Usuário ${this.usuario.ativo ? 'ativado' : 'desativado'} com sucesso!`
      });
      
      console.log(`Status do usuário alterado para: ${this.usuario.ativo ? 'Ativo' : 'Inativo'}`);
    }
  }

  voltar(): void {
    this.router.navigate(['/usuarios']);
  }
}
