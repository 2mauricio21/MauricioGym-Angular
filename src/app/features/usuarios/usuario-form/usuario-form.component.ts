import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Usuario {
  id?: number;
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
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    InputMaskModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex align-items-center justify-content-between mb-6">
          <div class="flex align-items-center">
            <p-button 
              icon="pi pi-arrow-left"
              (onClick)="voltar()"
              styleClass="p-button-text p-button-plain mr-3"
              pTooltip="Voltar">
            </p-button>
            <h1 class="text-3xl font-bold text-900 m-0">{{ isEdicao ? 'Editar Usuário' : 'Novo Usuário' }}</h1>
          </div>
        </div>

        <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
          <!-- Informações Pessoais -->
          <p-card header="Informações Pessoais">
            <div class="grid">
              <div class="col-12">
                <label class="block text-900 font-medium mb-2">Nome Completo *</label>
                <input 
                  pInputText
                  type="text" 
                  formControlName="nome"
                  class="w-full"
                  [class.ng-invalid]="usuarioForm.get('nome')?.invalid && usuarioForm.get('nome')?.touched">
                <small *ngIf="usuarioForm.get('nome')?.invalid && usuarioForm.get('nome')?.touched" class="p-error block">
                  Nome é obrigatório
                </small>
              </div>
              <div class="col-12 md:col-6">
                <label class="block text-900 font-medium mb-2">Email *</label>
                <input 
                  pInputText
                  type="email" 
                  formControlName="email"
                  class="w-full"
                  [class.ng-invalid]="usuarioForm.get('email')?.invalid && usuarioForm.get('email')?.touched">
                <small *ngIf="usuarioForm.get('email')?.invalid && usuarioForm.get('email')?.touched" class="p-error block">
                  <span *ngIf="usuarioForm.get('email')?.errors?.['required']">Email é obrigatório</span>
                  <span *ngIf="usuarioForm.get('email')?.errors?.['email']">Email inválido</span>
                </small>
              </div>
              <div class="col-12 md:col-6">
                <label class="block text-900 font-medium mb-2">Telefone *</label>
                <p-inputMask 
                  mask="(99) 99999-9999"
                  formControlName="telefone"
                  placeholder="(11) 99999-9999"
                  styleClass="w-full"
                  [class.ng-invalid]="usuarioForm.get('telefone')?.invalid && usuarioForm.get('telefone')?.touched">
                </p-inputMask>
                <small *ngIf="usuarioForm.get('telefone')?.invalid && usuarioForm.get('telefone')?.touched" class="p-error block">
                  Telefone é obrigatório
                </small>
              </div>
              <div class="col-12 md:col-6">
                <label class="block text-900 font-medium mb-2">CPF *</label>
                <p-inputMask 
                  mask="999.999.999-99"
                  formControlName="cpf"
                  placeholder="000.000.000-00"
                  styleClass="w-full"
                  [class.ng-invalid]="usuarioForm.get('cpf')?.invalid && usuarioForm.get('cpf')?.touched">
                </p-inputMask>
                <small *ngIf="usuarioForm.get('cpf')?.invalid && usuarioForm.get('cpf')?.touched" class="p-error block">
                  CPF é obrigatório
                </small>
              </div>
              <div class="col-12 md:col-6">
                <label class="block text-900 font-medium mb-2">Data de Nascimento *</label>
                <p-calendar 
                  formControlName="dataNascimento"
                  dateFormat="dd/mm/yy"
                  placeholder="dd/mm/aaaa"
                  styleClass="w-full"
                  [showIcon]="true"
                  [class.ng-invalid]="usuarioForm.get('dataNascimento')?.invalid && usuarioForm.get('dataNascimento')?.touched">
                </p-calendar>
                <small *ngIf="usuarioForm.get('dataNascimento')?.invalid && usuarioForm.get('dataNascimento')?.touched" class="p-error block">
                  Data de nascimento é obrigatória
                </small>
              </div>
              <div class="col-12 md:col-6">
                <label class="block text-900 font-medium mb-2">Status</label>
                <p-dropdown 
                  [options]="statusOptions"
                  formControlName="ativo"
                  placeholder="Selecione o status"
                  styleClass="w-full">
                </p-dropdown>
              </div>
            </div>
          </p-card>

          <!-- Endereço -->
          <p-card header="Endereço">
            <div class="grid">
              <div class="col-12 md:col-4">
                <label class="block text-900 font-medium mb-2">CEP *</label>
                <p-inputMask 
                  mask="99999-999"
                  formControlName="cep"
                  placeholder="00000-000"
                  (onBlur)="buscarCep()"
                  styleClass="w-full"
                  [class.ng-invalid]="usuarioForm.get('cep')?.invalid && usuarioForm.get('cep')?.touched">
                </p-inputMask>
                <small *ngIf="usuarioForm.get('cep')?.invalid && usuarioForm.get('cep')?.touched" class="p-error block">
                  CEP é obrigatório
                </small>
              </div>
              <div class="col-12 md:col-8">
                <label class="block text-900 font-medium mb-2">Logradouro *</label>
                <input 
                  pInputText
                  type="text" 
                  formControlName="logradouro"
                  class="w-full"
                  [class.ng-invalid]="usuarioForm.get('logradouro')?.invalid && usuarioForm.get('logradouro')?.touched">
                <small *ngIf="usuarioForm.get('logradouro')?.invalid && usuarioForm.get('logradouro')?.touched" class="p-error block">
                  Logradouro é obrigatório
                </small>
              </div>
              <div class="col-12 md:col-3">
                <label class="block text-900 font-medium mb-2">Número *</label>
                <input 
                  pInputText
                  type="text" 
                  formControlName="numero"
                  class="w-full"
                  [class.ng-invalid]="usuarioForm.get('numero')?.invalid && usuarioForm.get('numero')?.touched">
                <small *ngIf="usuarioForm.get('numero')?.invalid && usuarioForm.get('numero')?.touched" class="p-error block">
                  Número é obrigatório
                </small>
              </div>
              <div class="col-12 md:col-3">
                <label class="block text-900 font-medium mb-2">Complemento</label>
                <input 
                  pInputText
                  type="text" 
                  formControlName="complemento"
                  class="w-full">
              </div>
              <div class="col-12 md:col-6">
                <label class="block text-900 font-medium mb-2">Bairro *</label>
                <input 
                  pInputText
                  type="text" 
                  formControlName="bairro"
                  class="w-full"
                  [class.ng-invalid]="usuarioForm.get('bairro')?.invalid && usuarioForm.get('bairro')?.touched">
                <small *ngIf="usuarioForm.get('bairro')?.invalid && usuarioForm.get('bairro')?.touched" class="p-error block">
                  Bairro é obrigatório
                </small>
              </div>
              <div class="col-12 md:col-6">
                <label class="block text-900 font-medium mb-2">Cidade *</label>
                <input 
                  pInputText
                  type="text" 
                  formControlName="cidade"
                  class="w-full"
                  [class.ng-invalid]="usuarioForm.get('cidade')?.invalid && usuarioForm.get('cidade')?.touched">
                <small *ngIf="usuarioForm.get('cidade')?.invalid && usuarioForm.get('cidade')?.touched" class="p-error block">
                  Cidade é obrigatória
                </small>
              </div>
              <div class="col-12 md:col-6">
                <label class="block text-900 font-medium mb-2">Estado *</label>
                <p-dropdown 
                  [options]="estadoOptions"
                  formControlName="estado"
                  placeholder="Selecione o estado"
                  styleClass="w-full"
                  [class.ng-invalid]="usuarioForm.get('estado')?.invalid && usuarioForm.get('estado')?.touched">
                </p-dropdown>
                <small *ngIf="usuarioForm.get('estado')?.invalid && usuarioForm.get('estado')?.touched" class="p-error block">
                  Estado é obrigatório
                </small>
              </div>
            </div>
          </p-card>

          <!-- Observações -->
          <p-card header="Observações">
            <div>
              <label class="block text-900 font-medium mb-2">Observações</label>
              <textarea 
                pInputTextarea
                formControlName="observacoes"
                rows="4"
                class="w-full"
                placeholder="Observações adicionais sobre o usuário..."></textarea>
            </div>
          </p-card>

          <!-- Botões -->
          <div class="flex justify-content-end gap-3">
            <p-button 
              label="Cancelar"
              icon="pi pi-times"
              styleClass="p-button-outlined"
              (onClick)="voltar()">
            </p-button>
            <p-button 
              [label]="isEdicao ? 'Atualizar Usuário' : 'Criar Usuário'"
              icon="pi pi-check"
              type="submit"
              [disabled]="usuarioForm.invalid">
            </p-button>
          </div>
        </form>
      </div>
    </div>
    
    <p-toast></p-toast>
  `
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  isEdicao = false;
  usuarioId?: number;

  statusOptions = [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false }
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
    private messageService: MessageService
  ) {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      ativo: [true],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.params['id'];
    this.isEdicao = !!this.usuarioId;

    if (this.isEdicao) {
      this.carregarUsuario();
    }
  }

  carregarUsuario(): void {
    // TODO: Implementar carregamento do usuário via API
    // Dados mockados para desenvolvimento
    const usuarioMock: Usuario = {
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
      observacoes: 'Cliente VIP'
    };

    this.preencherForm(usuarioMock);
  }

  preencherForm(usuario: Usuario): void {
    this.usuarioForm.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
      dataNascimento: usuario.dataNascimento,
      ativo: usuario.ativo,
      cep: usuario.endereco.cep,
      logradouro: usuario.endereco.logradouro,
      numero: usuario.endereco.numero,
      complemento: usuario.endereco.complemento,
      bairro: usuario.endereco.bairro,
      cidade: usuario.endereco.cidade,
      estado: usuario.endereco.estado,
      observacoes: usuario.observacoes
    });
  }

  buscarCep(): void {
    const cep = this.usuarioForm.get('cep')?.value;
    if (cep && cep.length === 9) {
      // TODO: Implementar busca de CEP via API
      // Dados mockados para desenvolvimento
      const enderecoMock = {
        logradouro: 'Rua das Flores',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP'
      };

      this.usuarioForm.patchValue(enderecoMock);
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formData = this.usuarioForm.value;
      const usuario: Usuario = {
        id: this.usuarioId,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
        endereco: {
          cep: formData.cep,
          logradouro: formData.logradouro,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado
        },
        ativo: formData.ativo,
        observacoes: formData.observacoes
      };

      if (this.isEdicao) {
        // TODO: Implementar atualização via API
        console.log('Atualizando usuário:', usuario);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário atualizado com sucesso!'
        });
      } else {
        // TODO: Implementar criação via API
        console.log('Criando usuário:', usuario);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário criado com sucesso!'
        });
      }

      setTimeout(() => {
        this.voltar();
      }, 1500);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.'
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/usuarios']);
  }
}
