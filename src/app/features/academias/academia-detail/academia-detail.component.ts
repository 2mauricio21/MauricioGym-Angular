import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AcademiaService } from '../../../core/services/academia.service';
import { Academia } from '../../../core/models';

@Component({
  selector: 'app-academia-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TagModule,
    DividerModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="academia-detail" *ngIf="academia">
      <div class="header-section">
        <div class="title-section">
          <h1>{{ academia.nomeAcademia }}</h1>
          <p-tag 
            [value]="academia.statusAcademia" 
            [severity]="getStatusSeverity(academia.statusAcademia)">
          </p-tag>
        </div>
        <div class="action-buttons">
          <button 
            pButton 
            type="button" 
            label="Voltar" 
            icon="pi pi-arrow-left" 
            class="p-button-secondary"
            (click)="goBack()">
          </button>
          <button 
            pButton 
            type="button" 
            label="Editar" 
            icon="pi pi-pencil" 
            class="p-button-primary"
            [routerLink]="['/academias', academia.idAcademia, 'editar']">
          </button>
        </div>
      </div>

      <div class="content-section">
        <div class="info-grid">
          <!-- Informações Básicas -->
          <p-card header="Informações Básicas" class="info-card">
            <div class="info-item">
              <label>Nome:</label>
              <span>{{ academia.nomeAcademia }}</span>
            </div>
            <div class="info-item">
              <label>E-mail:</label>
              <span>{{ academia.email || 'Não informado' }}</span>
            </div>
            <div class="info-item">
              <label>Telefone:</label>
              <span>{{ academia.telefone || 'Não informado' }}</span>
            </div>
            <div class="info-item">
              <label>Status:</label>
              <p-tag 
                [value]="academia.statusAcademia" 
                [severity]="getStatusSeverity(academia.statusAcademia)">
              </p-tag>
            </div>
          </p-card>

          <!-- Endereço -->
          <p-card header="Endereço" class="info-card">
            <div class="info-item">
              <label>Endereço:</label>
              <span>{{ academia.endereco || 'Não informado' }}</span>
            </div>
            <div class="info-item">
              <label>Cidade:</label>
              <span>{{ academia.cidade || 'Não informado' }}</span>
            </div>
            <div class="info-item">
              <label>Estado:</label>
              <span>{{ academia.estado || 'Não informado' }}</span>
            </div>
            <div class="info-item" *ngIf="academia.cep">
              <label>CEP:</label>
              <span>{{ academia.cep }}</span>
            </div>
          </p-card>

          <!-- Datas -->
          <p-card header="Datas" class="info-card">
            <div class="info-item">
              <label>Data de Criação:</label>
              <span>{{ academia.dataCadastro | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <label>Status:</label>
              <span class="status-badge" [ngClass]="getStatusClass(academia.statusAcademia)">{{ getStatusLabel(academia.statusAcademia) }}</span>
            </div>
          </p-card>

          <!-- Observações -->
          <p-card header="Observações" class="info-card full-width" *ngIf="academia.observacoes">
            <p class="observacoes-text">{{ academia.observacoes }}</p>
          </p-card>
        </div>

        <!-- Estatísticas -->
        <div class="stats-section" *ngIf="stats">
          <h2>Estatísticas</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ stats.totalUsuarios || 0 }}</div>
              <div class="stat-label">Usuários Cadastrados</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats.usuariosAtivos || 0 }}</div>
              <div class="stat-label">Usuários Ativos</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats.totalPlanos || 0 }}</div>
              <div class="stat-label">Planos Disponíveis</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats.acessosHoje || 0 }}</div>
              <div class="stat-label">Acessos Hoje</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loading-state" *ngIf="loading">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
      <p>Carregando dados da academia...</p>
    </div>

    <div class="error-state" *ngIf="error && !loading">
      <i class="pi pi-exclamation-triangle" style="font-size: 3rem; color: var(--red-500);"></i>
      <h3>Erro ao carregar academia</h3>
      <p>{{ error }}</p>
      <button 
        pButton 
        type="button" 
        label="Tentar Novamente" 
        icon="pi pi-refresh" 
        (click)="loadAcademia()">
      </button>
    </div>

    <p-toast></p-toast>
  `,
  styleUrls: ['./academia-detail.component.scss']
})
export class AcademiaDetailComponent implements OnInit {
  academia?: Academia;
  stats?: any;
  loading = false;
  error?: string;
  academiaId?: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private academiaService: AcademiaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.academiaId = +params['id'];
        this.loadAcademia();
        this.loadStats();
      }
    });
  }

  loadAcademia(): void {
    if (!this.academiaId) return;

    this.loading = true;
    this.error = undefined;

    this.academiaService.consultar(this.academiaId).subscribe({
      next: (response: any) => {
        this.academia = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar academia:', error);
        this.error = 'Não foi possível carregar os dados da academia.';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar dados da academia'
        });
      }
    });
  }

  loadStats(): void {
    if (!this.academiaId) return;

    // Simular carregamento de estatísticas
    // Em um cenário real, você faria uma chamada para um endpoint específico
    setTimeout(() => {
      this.stats = {
        totalUsuarios: Math.floor(Math.random() * 500) + 100,
        usuariosAtivos: Math.floor(Math.random() * 300) + 50,
        totalPlanos: Math.floor(Math.random() * 10) + 3,
        acessosHoje: Math.floor(Math.random() * 50) + 10
      };
    }, 1000);
  }



  formatDate(date: string | Date): string {
    if (!date) return 'Não informado';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  }

  goBack(): void {
    this.router.navigate(['/academias']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ATIVA':
        return 'status-ativa';
      case 'INATIVA':
        return 'status-inativa';
      case 'SUSPENSA':
        return 'status-suspensa';
      default:
        return 'status-default';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ATIVA':
        return 'Ativa';
      case 'INATIVA':
        return 'Inativa';
      case 'SUSPENSA':
        return 'Suspensa';
      default:
        return status;
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'ATIVA':
        return 'success';
      case 'INATIVA':
        return 'danger';
      case 'SUSPENSA':
        return 'warning';
      default:
        return 'secondary';
    }
  }
}
