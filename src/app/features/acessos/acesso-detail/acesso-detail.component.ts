import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AcessoService } from '../../../core/services/acesso.service';

interface Acesso {
  id: number;
  usuarioId: number;
  nomeUsuario: string;
  emailUsuario: string;
  academiaId: number;
  nomeAcademia: string;
  enderecoAcademia: string;
  dataHora: Date;
  tipo: 'entrada' | 'saida';
  equipamentoId?: number;
  nomeEquipamento?: string;
  tipoEquipamento?: string;
  validado: boolean;
  observacoes?: string;
  ipOrigem?: string;
  dispositivoId?: string;
  dataCriacao: Date;
  dataValidacao?: Date;
}

@Component({
  selector: 'app-acesso-detail',
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
          <div class="flex space-x-2">
            <button 
              [routerLink]="['/acessos', acesso?.id, 'editar']"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Editar
            </button>
            <button 
              *ngIf="!acesso?.validado"
              (click)="validarAcesso()"
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Validar
            </button>
          </div>
        </div>

        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-500">Carregando...</p>
        </div>

        <div *ngIf="!loading && acesso" class="space-y-6">
          <!-- Status do Acesso -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold mb-2">Status do Acesso</h2>
                <div class="flex items-center space-x-4">
                  <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                        [class]="acesso.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ acesso.tipo | titlecase }}
                  </span>
                  <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                        [class]="acesso.validado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ acesso.validado ? 'Validado' : 'Pendente Validação' }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">Data/Hora do Acesso</p>
                <p class="text-lg font-medium">{{ acesso.dataHora | date:'dd/MM/yyyy HH:mm:ss' }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Informações do Usuário -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-4">Informações do Usuário</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <span class="text-lg font-medium text-gray-600">{{ getInitials(acesso.nomeUsuario) }}</span>
                  </div>
                  <div>
                    <p class="font-medium">{{ acesso.nomeUsuario }}</p>
                    <p class="text-sm text-gray-600">{{ acesso.emailUsuario }}</p>
                  </div>
                </div>
                <div class="border-t pt-3">
                  <div class="text-sm">
                    <span class="text-gray-600">ID do Usuário:</span>
                    <p class="font-medium">{{ acesso.usuarioId }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informações da Academia -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-4">Local do Acesso</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-600">Academia</label>
                  <p class="text-lg font-medium">{{ acesso.nomeAcademia }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Endereço</label>
                  <p class="text-sm text-gray-900">{{ acesso.enderecoAcademia }}</p>
                </div>
                <div *ngIf="acesso.nomeEquipamento">
                  <label class="text-sm font-medium text-gray-600">Equipamento</label>
                  <p class="text-sm text-gray-900">
                    {{ acesso.nomeEquipamento }}
                    <span *ngIf="acesso.tipoEquipamento" class="text-gray-500">({{ acesso.tipoEquipamento }})</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Detalhes Técnicos -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Detalhes Técnicos</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Data de Registro</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.dataCriacao | date:'dd/MM/yyyy HH:mm:ss' }}</p>
              </div>
              <div *ngIf="acesso.dataValidacao">
                <label class="block text-sm font-medium text-gray-500">Data de Validação</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.dataValidacao | date:'dd/MM/yyyy HH:mm:ss' }}</p>
              </div>
              <div *ngIf="acesso.ipOrigem">
                <label class="block text-sm font-medium text-gray-500">IP de Origem</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.ipOrigem }}</p>
              </div>
              <div *ngIf="acesso.dispositivoId">
                <label class="block text-sm font-medium text-gray-500">ID do Dispositivo</label>
                <p class="mt-1 text-sm text-gray-900">{{ acesso.dispositivoId }}</p>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div *ngIf="acesso.observacoes" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Observações</h3>
            <p class="text-gray-900 whitespace-pre-wrap">{{ acesso.observacoes }}</p>
          </div>

          <!-- Acessos Relacionados -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Outros Acessos do Usuário (Hoje)</h3>
            <div *ngIf="acessosRelacionados.length > 0" class="space-y-3">
              <div *ngFor="let acessoRel of acessosRelacionados" 
                   class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        [class]="acessoRel.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ acessoRel.tipo | titlecase }}
                  </span>
                  <span class="text-sm text-gray-900">{{ acessoRel.dataHora | date:'HH:mm:ss' }}</span>
                  <span class="text-sm text-gray-600">{{ acessoRel.nomeAcademia }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        [class]="acessoRel.validado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ acessoRel.validado ? 'Validado' : 'Pendente' }}
                  </span>
                  <button 
                    [routerLink]="['/acessos', acessoRel.id]"
                    class="text-blue-600 hover:text-blue-900 text-sm">
                    Ver
                  </button>
                </div>
              </div>
            </div>
            <div *ngIf="acessosRelacionados.length === 0" class="text-center py-4">
              <p class="text-gray-500">Nenhum outro acesso encontrado para hoje.</p>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && !acesso" class="text-center py-8">
          <p class="text-gray-500">Acesso não encontrado.</p>
        </div>
      </div>
    </div>
  `
})
export class AcessoDetailComponent implements OnInit {
  acesso: Acesso | null = null;
  acessosRelacionados: Acesso[] = [];
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
      this.carregarAcessosRelacionados();
    }
  }

  carregarAcesso(): void {
    this.loading = true;
    
    // TODO: Implementar chamada para API
    setTimeout(() => {
      if (this.acessoId === 1) {
        this.acesso = {
          id: 1,
          usuarioId: 1,
          nomeUsuario: 'João Silva',
          emailUsuario: 'joao@email.com',
          academiaId: 1,
          nomeAcademia: 'Academia Central',
          enderecoAcademia: 'Rua Principal, 123 - Centro',
          dataHora: new Date('2024-01-20T08:30:00'),
          tipo: 'entrada',
          equipamentoId: 1,
          nomeEquipamento: 'Catraca Principal',
          tipoEquipamento: 'Catraca Eletrônica',
          validado: true,
          observacoes: 'Acesso registrado automaticamente via cartão RFID.',
          ipOrigem: '192.168.1.100',
          dispositivoId: 'CATR001',
          dataCriacao: new Date('2024-01-20T08:30:05'),
          dataValidacao: new Date('2024-01-20T08:30:10')
        };
      } else {
        this.acesso = {
          id: this.acessoId,
          usuarioId: 2,
          nomeUsuario: 'Maria Santos',
          emailUsuario: 'maria@email.com',
          academiaId: 1,
          nomeAcademia: 'Academia Central',
          enderecoAcademia: 'Rua Principal, 123 - Centro',
          dataHora: new Date('2024-01-20T09:15:00'),
          tipo: 'entrada',
          validado: false,
          observacoes: 'Acesso via aplicativo móvel - aguardando validação.',
          ipOrigem: '10.0.0.50',
          dataCriacao: new Date('2024-01-20T09:15:02')
        };
      }
      this.loading = false;
    }, 500);
  }

  carregarAcessosRelacionados(): void {
    // TODO: Implementar chamada para API
    setTimeout(() => {
      this.acessosRelacionados = [
        {
          id: 3,
          usuarioId: 1,
          nomeUsuario: 'João Silva',
          emailUsuario: 'joao@email.com',
          academiaId: 1,
          nomeAcademia: 'Academia Central',
          enderecoAcademia: 'Rua Principal, 123 - Centro',
          dataHora: new Date('2024-01-20T10:45:00'),
          tipo: 'saida' as 'entrada' | 'saida',
          equipamentoId: 1,
          nomeEquipamento: 'Catraca Principal',
          tipoEquipamento: 'Catraca Eletrônica',
          validado: true,
          dataCriacao: new Date('2024-01-20T10:45:03'),
          dataValidacao: new Date('2024-01-20T10:45:05')
        }
      ].filter(a => a.usuarioId === this.acesso?.usuarioId && a.id !== this.acessoId);
    }, 800);
  }

  getInitials(nome: string): string {
    if (!nome) return '';
    return nome.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  validarAcesso(): void {
    if (confirm('Confirma a validação deste acesso?')) {
      // TODO: Implementar chamada para API
      if (this.acesso) {
        this.acesso.validado = true;
        this.acesso.dataValidacao = new Date();
      }
    }
  }

  voltar(): void {
    this.router.navigate(['/acessos']);
  }
}