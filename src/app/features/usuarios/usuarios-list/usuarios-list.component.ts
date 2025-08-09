import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models';

interface EstatisticasUsuarios {
  total: number;
  ativos: number;
  comPlano: number;
  novos: number;
}

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Usuários</h1>
        <button 
          routerLink="/usuarios/novo"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          + Novo Usuário
        </button>
      </div>

      <!-- Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total de Usuários</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.total }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Usuários Ativos</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.ativos }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Com Plano</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.comPlano }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Novos (30 dias)</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.novos }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input 
              type="text" 
              [(ngModel)]="filtros.busca"
              (input)="aplicarFiltros()"
              placeholder="Nome, email ou telefone..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              [(ngModel)]="filtros.status"
              (change)="aplicarFiltros()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Plano</label>
            <select 
              [(ngModel)]="filtros.plano"
              (change)="aplicarFiltros()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="com-plano">Com Plano</option>
              <option value="sem-plano">Sem Plano</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              (click)="limparFiltros()"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Tabela de Usuários -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano Atual</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acesso</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let usuario of usuariosFiltrados" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">{{ usuario.nome.charAt(0).toUpperCase() }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ usuario.nome }}</div>
                      <div class="text-sm text-gray-500">ID: {{ usuario.idUsuario }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ usuario.email }}</div>
                  <div class="text-sm text-gray-500">{{ usuario.telefone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    Em desenvolvimento
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ usuario.dataUltimoLogin | date:'dd/MM/yyyy HH:mm' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    [class]="usuario.ativo ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' : 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'">
                    {{ usuario.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      [routerLink]="['/usuarios', usuario.idUsuario]"
                      class="btn-table-action btn-table-view">
                      Ver
                    </button>
                    <button 
                      [routerLink]="['/usuarios', usuario.idUsuario, 'editar']"
                      class="btn-table-action btn-table-edit">
                      Editar
                    </button>
                    <button 
                      (click)="alterarStatus(usuario)"
                      [class]="usuario.ativo ? 'btn-table-action btn-table-delete' : 'btn-table-action btn-table-edit'">
                      {{ usuario.ativo ? 'Desativar' : 'Ativar' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginação -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="btn-pagination">
              Anterior
            </button>
            <button class="btn-pagination ml-3">
              Próximo
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">1</span> a <span class="font-medium">{{ usuariosFiltrados.length }}</span> de <span class="font-medium">{{ usuariosFiltrados.length }}</span> resultados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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

  constructor(private usuarioService: UsuarioService) {}

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

  alterarStatus(usuario: Usuario): void {
    const novoStatus = !usuario.ativo;
    
    this.usuarioService.alterarStatusUsuario(usuario.idUsuario, novoStatus).subscribe({
      next: (response) => {
        usuario.ativo = novoStatus;
        this.calcularEstatisticas();
        console.log(`Status do usuário ${usuario.nome} alterado para ${novoStatus ? 'ativo' : 'inativo'}`);
      },
      error: (error) => {
        console.error('Erro ao alterar status do usuário:', error);
      }
    });
  }
}
