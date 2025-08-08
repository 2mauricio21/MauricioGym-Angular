import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BloqueioService } from '../../../core/services/bloqueio.service';

interface Bloqueio {
  id: number;
  usuarioId: number;
  nomeUsuario: string;
  motivo: string;
  dataInicio: Date;
  dataFim?: Date;
  ativo: boolean;
}

@Component({
  selector: 'app-bloqueios-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Bloqueios de Acesso</h1>
        <button 
          [routerLink]="['/bloqueios/novo']"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Novo Bloqueio
        </button>
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Início
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Fim
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let bloqueio of bloqueios">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ bloqueio.nomeUsuario }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ bloqueio.motivo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ bloqueio.dataInicio | date:'dd/MM/yyyy' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ bloqueio.dataFim ? (bloqueio.dataFim | date:'dd/MM/yyyy') : 'Indefinido' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [class]="bloqueio.ativo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                    {{ bloqueio.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    [routerLink]="['/bloqueios', bloqueio.id]"
                    class="text-indigo-600 hover:text-indigo-900 mr-3">
                    Ver
                  </button>
                  <button 
                    [routerLink]="['/bloqueios', bloqueio.id, 'editar']"
                    class="text-blue-600 hover:text-blue-900 mr-3">
                    Editar
                  </button>
                  <button 
                    (click)="removerBloqueio(bloqueio.id)"
                    class="text-red-600 hover:text-red-900">
                    Remover
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="bloqueios.length === 0" class="text-center py-8">
        <p class="text-gray-500">Nenhum bloqueio encontrado.</p>
      </div>
    </div>
  `
})
export class BloqueiosListComponent implements OnInit {
  bloqueios: Bloqueio[] = [];
  loading = false;

  constructor(private bloqueioService: BloqueioService) {}

  ngOnInit(): void {
    this.carregarBloqueios();
  }

  carregarBloqueios(): void {
    this.loading = true;
    // TODO: Implementar chamada para API
    // this.bloqueioService.listar().subscribe({
    //   next: (bloqueios) => {
    //     this.bloqueios = bloqueios;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar bloqueios:', error);
    //     this.loading = false;
    //   }
    // });
    
    // Mock data para desenvolvimento
    this.bloqueios = [
      {
        id: 1,
        usuarioId: 1,
        nomeUsuario: 'João Silva',
        motivo: 'Inadimplência',
        dataInicio: new Date('2024-01-15'),
        dataFim: new Date('2024-02-15'),
        ativo: true
      },
      {
        id: 2,
        usuarioId: 2,
        nomeUsuario: 'Maria Santos',
        motivo: 'Comportamento inadequado',
        dataInicio: new Date('2024-01-10'),
        ativo: false
      }
    ];
    this.loading = false;
  }

  removerBloqueio(id: number): void {
    if (confirm('Tem certeza que deseja remover este bloqueio?')) {
      // TODO: Implementar chamada para API
      // this.bloqueioService.remover(id).subscribe({
      //   next: () => {
      //     this.carregarBloqueios();
      //   },
      //   error: (error) => {
      //     console.error('Erro ao remover bloqueio:', error);
      //   }
      // });
      
      // Mock para desenvolvimento
      this.bloqueios = this.bloqueios.filter(b => b.id !== id);
    }
  }
}
