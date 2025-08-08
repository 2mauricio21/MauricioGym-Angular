import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AcademiaService } from '../../../core/services/academia.service';
import { Academia } from '../../../core/models';

@Component({
  selector: 'app-academia-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="academia-form">
      <div class="header-section">
        <h1>{{ isEditMode ? 'Editar Academia' : 'Nova Academia' }}</h1>
        <button 
          pButton 
          type="button" 
          label="Voltar" 
          icon="pi pi-arrow-left" 
          class="p-button-secondary"
          (click)="goBack()">
        </button>
      </div>

      <div class="form-section">
        <form [formGroup]="academiaForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Informações Básicas -->
            <div class="form-group">
              <label for="nomeAcademia">Nome da Academia *</label>
              <input 
                id="nomeAcademia"
                type="text" 
                pInputText 
                formControlName="nomeAcademia"
                placeholder="Digite o nome da academia"
                [class.ng-invalid]="academiaForm.get('nomeAcademia')?.invalid && academiaForm.get('nomeAcademia')?.touched">
              <small 
                class="p-error" 
                *ngIf="academiaForm.get('nomeAcademia')?.invalid && academiaForm.get('nomeAcademia')?.touched">
                Nome da academia é obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="emailAcademia">E-mail *</label>
              <input 
                id="emailAcademia"
                type="email" 
                pInputText 
                formControlName="emailAcademia"
                placeholder="Digite o e-mail da academia"
                [class.ng-invalid]="academiaForm.get('emailAcademia')?.invalid && academiaForm.get('emailAcademia')?.touched">
              <small 
                class="p-error" 
                *ngIf="academiaForm.get('emailAcademia')?.invalid && academiaForm.get('emailAcademia')?.touched">
                E-mail válido é obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="telefoneAcademia">Telefone *</label>
              <input 
                id="telefoneAcademia"
                type="tel" 
                pInputText 
                formControlName="telefoneAcademia"
                placeholder="(00) 00000-0000"
                [class.ng-invalid]="academiaForm.get('telefoneAcademia')?.invalid && academiaForm.get('telefoneAcademia')?.touched">
              <small 
                class="p-error" 
                *ngIf="academiaForm.get('telefoneAcademia')?.invalid && academiaForm.get('telefoneAcademia')?.touched">
                Telefone é obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="statusAcademia">Status *</label>
              <p-dropdown 
                id="statusAcademia"
                formControlName="statusAcademia"
                [options]="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Selecione o status"
                [class.ng-invalid]="academiaForm.get('statusAcademia')?.invalid && academiaForm.get('statusAcademia')?.touched">
              </p-dropdown>
              <small 
                class="p-error" 
                *ngIf="academiaForm.get('statusAcademia')?.invalid && academiaForm.get('statusAcademia')?.touched">
                Status é obrigatório
              </small>
            </div>

            <!-- Endereço -->
            <div class="form-group full-width">
              <label for="enderecoAcademia">Endereço *</label>
              <input 
                id="enderecoAcademia"
                type="text" 
                pInputText 
                formControlName="enderecoAcademia"
                placeholder="Digite o endereço completo"
                [class.ng-invalid]="academiaForm.get('enderecoAcademia')?.invalid && academiaForm.get('enderecoAcademia')?.touched">
              <small 
                class="p-error" 
                *ngIf="academiaForm.get('enderecoAcademia')?.invalid && academiaForm.get('enderecoAcademia')?.touched">
                Endereço é obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="cidadeAcademia">Cidade *</label>
              <input 
                id="cidadeAcademia"
                type="text" 
                pInputText 
                formControlName="cidadeAcademia"
                placeholder="Digite a cidade"
                [class.ng-invalid]="academiaForm.get('cidadeAcademia')?.invalid && academiaForm.get('cidadeAcademia')?.touched">
              <small 
                class="p-error" 
                *ngIf="academiaForm.get('cidadeAcademia')?.invalid && academiaForm.get('cidadeAcademia')?.touched">
                Cidade é obrigatória
              </small>
            </div>

            <div class="form-group">
              <label for="estadoAcademia">Estado *</label>
              <p-dropdown 
                id="estadoAcademia"
                formControlName="estadoAcademia"
                [options]="estadoOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Selecione o estado"
                [class.ng-invalid]="academiaForm.get('estadoAcademia')?.invalid && academiaForm.get('estadoAcademia')?.touched">
              </p-dropdown>
              <small 
                class="p-error" 
                *ngIf="academiaForm.get('estadoAcademia')?.invalid && academiaForm.get('estadoAcademia')?.touched">
                Estado é obrigatório
              </small>
            </div>

            <div class="form-group">
              <label for="cepAcademia">CEP</label>
              <input 
                id="cepAcademia"
                type="text" 
                pInputText 
                formControlName="cepAcademia"
                placeholder="00000-000">
            </div>

            <!-- Datas -->
            <div class="form-group">
              <label for="dataAbertura">Data de Abertura</label>
              <p-calendar 
                id="dataAbertura"
                formControlName="dataAbertura"
                dateFormat="dd/mm/yy"
                placeholder="Selecione a data"
                [showIcon]="true">
              </p-calendar>
            </div>

            <div class="form-group">
              <label for="dataFechamento">Data de Fechamento</label>
              <p-calendar 
                id="dataFechamento"
                formControlName="dataFechamento"
                dateFormat="dd/mm/yy"
                placeholder="Selecione a data"
                [showIcon]="true">
              </p-calendar>
            </div>

            <!-- Observações -->
            <div class="form-group full-width">
              <label for="observacoesAcademia">Observações</label>
              <textarea 
                id="observacoesAcademia"
                pInputTextarea 
                formControlName="observacoesAcademia"
                placeholder="Digite observações adicionais"
                rows="4">
              </textarea>
            </div>
          </div>

          <div class="form-actions">
            <button 
              pButton 
              type="button" 
              label="Cancelar" 
              class="p-button-secondary"
              (click)="goBack()">
            </button>
            <button 
              pButton 
              type="submit" 
              [label]="isEditMode ? 'Atualizar' : 'Criar'"
              [loading]="loading"
              [disabled]="academiaForm.invalid || loading"
              class="p-button-primary">
            </button>
          </div>
        </form>
      </div>
    </div>

    <p-toast></p-toast>
  `,
  styleUrls: ['./academia-form.component.scss']
})
export class AcademiaFormComponent implements OnInit {
  academiaForm!: FormGroup;
  loading = false;
  isEditMode = false;
  academiaId?: number;

  statusOptions = [
    { label: 'Ativa', value: 'Ativa' },
    { label: 'Inativa', value: 'Inativa' },
    { label: 'Manutenção', value: 'Manutencao' }
  ];

  estadoOptions = [
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private academiaService: AcademiaService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.academiaId = +params['id'];
        this.loadAcademia();
      }
    });
  }

  initForm(): void {
    this.academiaForm = this.fb.group({
      nomeAcademia: ['', [Validators.required, Validators.maxLength(100)]],
      emailAcademia: ['', [Validators.required, Validators.email]],
      telefoneAcademia: ['', [Validators.required]],
      enderecoAcademia: ['', [Validators.required]],
      cidadeAcademia: ['', [Validators.required]],
      estadoAcademia: ['', [Validators.required]],
      cepAcademia: [''],
      statusAcademia: ['Ativa', [Validators.required]],
      dataAbertura: [null],
      dataFechamento: [null],
      observacoesAcademia: ['']
    });
  }

  loadAcademia(): void {
    if (!this.academiaId) return;

    this.loading = true;
    this.academiaService.consultar(this.academiaId).subscribe({
      next: (response: any) => {
        const academia = response.data;
        this.academiaForm.patchValue({
          ...academia,
          dataAbertura: academia.dataAbertura ? new Date(academia.dataAbertura) : null,
          dataFechamento: academia.dataFechamento ? new Date(academia.dataFechamento) : null
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar academia:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar dados da academia'
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.academiaForm.invalid) {
      this.academiaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = { ...this.academiaForm.value };

    // Converter datas para string se necessário
    if (formData.dataAbertura) {
      formData.dataAbertura = formData.dataAbertura.toISOString();
    }
    if (formData.dataFechamento) {
      formData.dataFechamento = formData.dataFechamento.toISOString();
    }

    const request = this.isEditMode
      ? this.academiaService.alterar({ ...formData, idAcademia: this.academiaId })
      : this.academiaService.incluir(formData);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Academia ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso`
        });
        setTimeout(() => this.goBack(), 1500);
      },
      error: (error: any) => {
        console.error('Erro ao salvar academia:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} academia`
        });
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/academias']);
  }
}
