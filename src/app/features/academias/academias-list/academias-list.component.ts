import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AcademiaService } from '../../../core/services/academia.service';
import { Academia } from '../../../core/models';

@Component({
  selector: 'app-academias-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="academias-list">
      <div class="header-section">
        <h1>Academias</h1>
        <button 
          pButton 
          type="button" 
          label="Nova Academia" 
          icon="pi pi-plus" 
          routerLink="/academias/nova"
          class="p-button-primary">
        </button>
      </div>

      <div class="filters-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-search"></i>
          </span>
          <input 
            type="text" 
            pInputText 
            placeholder="Buscar academias..." 
            [(ngModel)]="searchTerm"
            (input)="onSearch()">
        </div>
      </div>

      <div class="table-section">
        <p-table 
          [value]="academias" 
          [loading]="loading"
          [paginator]="true" 
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} academias"
          [rowsPerPageOptions]="[10, 25, 50]"
          responsiveLayout="scroll">
          
          <ng-template pTemplate="header">
            <tr>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-academia>
            <tr>
              <td>
                <div class="academia-info">
                  <strong>{{ academia.nomeAcademia }}</strong>
                  <small class="text-muted d-block">{{ academia.emailAcademia }}</small>
                </div>
              </td>
              <td>
                <div class="endereco-info">
                  {{ academia.enderecoAcademia }}
                  <small class="text-muted d-block">{{ academia.cidadeAcademia }} - {{ academia.estadoAcademia }}</small>
                </div>
              </td>
              <td>{{ academia.telefoneAcademia }}</td>
              <td>
                <p-tag 
                  [value]="academia.statusAcademia" 
                  [severity]="getStatusSeverity(academia.statusAcademia)">
                </p-tag>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    pButton 
                    type="button" 
                    icon="pi pi-eye" 
                    class="p-button-text p-button-info"
                    [routerLink]="['/academias', academia.idAcademia]"
                    pTooltip="Visualizar">
                  </button>
                  <button 
                    pButton 
                    type="button" 
                    icon="pi pi-pencil" 
                    class="p-button-text p-button-warning"
                    [routerLink]="['/academias', academia.idAcademia, 'editar']"
                    pTooltip="Editar">
                  </button>
                  <button 
                    pButton 
                    type="button" 
                    icon="pi pi-trash" 
                    class="p-button-text p-button-danger"
                    (click)="confirmDelete(academia)"
                    pTooltip="Excluir">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center">
                <div class="empty-state">
                  <i class="pi pi-building" style="font-size: 3rem; color: var(--text-color-secondary);"></i>
                  <h3>Nenhuma academia encontrada</h3>
                  <p>Comece criando sua primeira academia.</p>
                  <button 
                    pButton 
                    type="button" 
                    label="Nova Academia" 
                    icon="pi pi-plus" 
                    routerLink="/academias/nova">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-confirmDialog></p-confirmDialog>
    <p-toast></p-toast>
  `,
  styleUrls: ['./academias-list.component.scss']
})
export class AcademiasListComponent implements OnInit {
  academias: Academia[] = [];
  loading = false;
  searchTerm = '';

  constructor(
    private academiaService: AcademiaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAcademias();
  }

  loadAcademias(): void {
    this.loading = true;
    this.academiaService.listar().subscribe({
      next: (response: any) => {
        this.academias = response.data || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar academias:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar academias'
        });
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    // Implementar busca local ou via API
    if (this.searchTerm.trim()) {
      // Filtro local simples
      this.academias = this.academias.filter(academia => 
        academia.nomeAcademia.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        academia.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.loadAcademias();
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status?.toLowerCase()) {
      case 'ativa':
        return 'success';
      case 'inativa':
        return 'danger';
      case 'manutencao':
        return 'warning';
      default:
        return 'info';
    }
  }

  confirmDelete(academia: Academia): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a academia "${academia.nomeAcademia}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAcademia(academia.idAcademia);
      }
    });
  }

  deleteAcademia(id: number): void {
    this.academiaService.excluir(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Academia excluída com sucesso'
        });
        this.loadAcademias();
      },
      error: (error: any) => {
        console.error('Erro ao excluir academia:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir academia'
        });
      }
    });
  }
}
