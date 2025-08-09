import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

interface EstatisticasUsuarios {
  total: number;
  ativos: number;
  comPlano: number;
  novos: number;
}

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    CardModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="p-6">
      <!-- Header com Toolbar -->
      <p-toolbar styleClass="mb-4 gap-2">
        <ng-template pTemplate="start">
          <h1 class="text-2xl font-bold text-gray-800 m-0">Gestão de Usuários</h1>
        </ng-template>
        <ng-template pTemplate="end">
          <p-button 
            label="Novo Usuário" 
            icon="pi pi-plus" 
            [routerLink]="['/usuarios/novo']"
            styleClass="p-button-success">
          </p-button>
        </ng-template>
      </p-toolbar>

      <!-- Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <p-card styleClass="text-center">
          <div class="flex flex-column align-items-center">
            <i class="pi pi-users text-4xl text-blue-500 mb-2"></i>
            <span class="text-2xl font-bold text-900">{{ estatisticas.total }}</span>
            <span class="text-600">Total de Usuários</span>
          </div>
        </p-card>
        
        <p-card styleClass="text-center">
          <div class="flex flex-column align-items-center">
            <i class="pi pi-check-circle text-4xl text-green-500 mb-2"></i>
            <span class="text-2xl font-bold text-900">{{ estatisticas.ativos }}</span>
            <span class="text-600">Usuários Ativos</span>
          </div>
        </p-card>
        
        <p-card styleClass="text-center">
          <div class="flex flex-column align-items-center">
            <i class="pi pi-credit-card text-4xl text-purple-500 mb-2"></i>
            <span class="text-2xl font-bold text-900">{{ estatisticas.comPlano }}</span>
            <span class="text-600">Com Plano</span>
          </div>
        </p-card>
        
        <p-card styleClass="text-center">
          <div class="flex flex-column align-items-center">
            <i class="pi pi-clock text-4xl text-orange-500 mb-2"></i>
            <span class="text-2xl font-bold text-900">{{ estatisticas.novos }}</span>
            <span class="text-600">Novos (30 dias)</span>
          </div>
        </p-card>
      </div>

      <!-- Filtros -->
      <p-card header="Filtros" styleClass="mb-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="field">
            <label for="busca" class="block text-sm font-medium mb-2">Buscar</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search"></i>
              <input 
                id="busca"
                type="text" 
                pInputText
                [(ngModel)]="filtros.busca"
                (input)="aplicarFiltros()"
                placeholder="Nome, email ou telefone..."
                class="w-full">
            </span>
          </div>
          
          <div class="field">
            <label for="status" class="block text-sm font-medium mb-2">Status</label>
            <p-dropdown 
              id="status"
              [(ngModel)]="filtros.status"
              [options]="statusOptions"
              (onChange)="aplicarFiltros()"
              placeholder="Todos os status"
              optionLabel="label"
              optionValue="value"
              styleClass="w-full">
            </p-dropdown>
          </div>
          
          <div class="field">
            <label for="plano" class="block text-sm font-medium mb-2">Plano</label>
            <p-dropdown 
              id="plano"
              [(ngModel)]="filtros.plano"
              [options]="planoOptions"
              (onChange)="aplicarFiltros()"
              placeholder="Todos os planos"
              optionLabel="label"
              optionValue="value"
              styleClass="w-full">
            </p-dropdown>
          </div>
          
          <div class="field flex align-items-end">
            <p-button 
              label="Limpar Filtros" 
              icon="pi pi-filter-slash"
              (onClick)="limparFiltros()"
              styleClass="p-button-outlined w-full">
            </p-button>
          </div>
        </div>
      </p-card>

      <!-- Tabela de Usuários -->
      <p-card>
        <p-table 
          [value]="usuariosFiltrados" 
          [loading]="loading"
          [paginator]="true" 
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuários"
          [rowsPerPageOptions]="[10, 25, 50]"
          styleClass="p-datatable-gridlines">
          
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="nome">Usuário <p-sortIcon field="nome"></p-sortIcon></th>
              <th>Contato</th>
              <th>Plano Atual</th>
              <th pSortableColumn="dataUltimoLogin">Último Acesso <p-sortIcon field="dataUltimoLogin"></p-sortIcon></th>
              <th pSortableColumn="ativo">Status <p-sortIcon field="ativo"></p-sortIcon></th>
              <th>Ações</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-usuario>
            <tr>
              <td>
                <div class="flex align-items-center">
                  <div class="w-3rem h-3rem border-circle bg-gray-300 flex align-items-center justify-content-center mr-3">
                    <span class="font-bold text-gray-700">{{ getInitials(usuario.nome) }}</span>
                  </div>
                  <div>
                    <div class="font-medium text-900">{{ usuario.nome }} {{ usuario.sobrenome }}</div>
                    <div class="text-600 text-sm">ID: {{ usuario.idUsuario }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="text-900">{{ usuario.email }}</div>
                <div class="text-600 text-sm">{{ usuario.telefone }}</div>
              </td>
              <td>
                <p-tag value="Em desenvolvimento" severity="info"></p-tag>
              </td>
              <td>
                <span class="text-600">{{ usuario.dataUltimoLogin | date:'dd/MM/yyyy HH:mm' }}</span>
              </td>
              <td>
                <p-tag 
                  [value]="usuario.ativo ? 'Ativo' : 'Inativo'"
                  [severity]="usuario.ativo ? 'success' : 'danger'">
                </p-tag>
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button 
                    icon="pi pi-eye" 
                    [routerLink]="['/usuarios', usuario.idUsuario]"
                    styleClass="p-button-rounded p-button-text p-button-info"
                    pTooltip="Visualizar">
                  </p-button>
                  <p-button 
                    icon="pi pi-pencil" 
                    [routerLink]="['/usuarios', usuario.idUsuario, 'editar']"
                    styleClass="p-button-rounded p-button-text p-button-warning"
                    pTooltip="Editar">
                  </p-button>
                  <p-button 
                    [icon]="usuario.ativo ? 'pi pi-times' : 'pi pi-check'" 
                    (onClick)="confirmarAlteracaoStatus(usuario)"
                    [styleClass]="usuario.ativo ? 'p-button-rounded p-button-text p-button-danger' : 'p-button-rounded p-button-text p-button-success'"
                    [pTooltip]="usuario.ativo ? 'Desativar' : 'Ativar'">
                  </p-button>
                </div>
              </td>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center p-4">
                <i class="pi pi-info-circle text-4xl text-400 mb-3"></i>
                <div class="text-600">Nenhum usuário encontrado</div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
    
    <p-confirmDialog></p-confirmDialog>
    <p-toast></p-toast>
  `
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  estatisticas: EstatisticasUsuarios = {
    total: 0,
    ativos: 0,
    comPlano: 0,
    novos: 0
  };

  filtros = {
    busca: '',
    status: '',
    plano: ''
  };

  loading = false;

  statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' }
  ];

  planoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Básico', value: 'basico' },
    { label: 'Premium', value: 'premium' },
    { label: 'Enterprise', value: 'enterprise' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
    this.calcularEstatisticas();
  }

  carregarUsuarios(): void {
    this.loading = true;
    
    this.usuarioService.listarUsuarios().subscribe({
      next: (response) => {
        this.usuarios = response.data || [];
        this.usuariosFiltrados = [...this.usuarios];
        this.calcularEstatisticas();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.usuarios = [];
        this.usuariosFiltrados = [];
        this.loading = false;
      }
    });
  }

  calcularEstatisticas(): void {
    // Carregar estatísticas via API
    this.usuarioService.obterEstatisticasUsuarios().subscribe({
      next: (response) => {
        const stats = response.data || {};
        this.estatisticas = {
          total: stats.total || this.usuarios.length,
          ativos: stats.ativos || this.usuarios.filter(u => u.ativo).length,
          comPlano: stats.comPlano || 0,
          novos: stats.novos || 0
        };
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
        // Fallback para cálculo local
        this.estatisticas = {
          total: this.usuarios.length,
          ativos: this.usuarios.filter(u => u.ativo).length,
          comPlano: 0,
          novos: 0
        };
      }
    });
  }

  aplicarFiltros(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const matchBusca = !this.filtros.busca || 
        usuario.nome.toLowerCase().includes(this.filtros.busca.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.filtros.busca.toLowerCase()) ||
        (usuario.telefone && usuario.telefone.includes(this.filtros.busca));

      const matchStatus = !this.filtros.status || 
        (this.filtros.status === 'ativo' && usuario.ativo) ||
        (this.filtros.status === 'inativo' && !usuario.ativo);

      const matchPlano = !this.filtros.plano;
        // TODO: Implementar filtro por plano quando integração estiver completa

      return matchBusca && matchStatus && matchPlano;
    });
  }

  limparFiltros(): void {
    this.filtros = {
      busca: '',
      status: '',
      plano: ''
    };
    this.aplicarFiltros();
  }

  getInitials(nome: string): string {
    if (!nome) return '';
    const nomes = nome.split(' ');
    if (nomes.length === 1) {
      return nomes[0].charAt(0).toUpperCase();
    }
    return (nomes[0].charAt(0) + nomes[nomes.length - 1].charAt(0)).toUpperCase();
  }

  confirmarAlteracaoStatus(usuario: Usuario): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja ${usuario.ativo ? 'desativar' : 'ativar'} o usuário ${usuario.nome}?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.alterarStatus(usuario);
      }
    });
  }

  alterarStatus(usuario: Usuario): void {
    const novoStatus = !usuario.ativo;
    
    this.usuarioService.alterarStatusUsuario(usuario.idUsuario, novoStatus).subscribe({
      next: (response) => {
        usuario.ativo = novoStatus;
        this.calcularEstatisticas();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Usuário ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`
        });
      },
      error: (error) => {
        console.error('Erro ao alterar status do usuário:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao alterar status do usuário'
        });
      }
    });
  }
}
