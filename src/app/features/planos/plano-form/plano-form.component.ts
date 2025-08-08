import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface Plano {
  id?: number;
  nome: string;
  descricao: string;
  valor: number;
  duracaoMeses: number;
  ativo: boolean;
  beneficios: string[];
  limitesAcesso?: {
    academias?: number[];
    horarios?: string;
    equipamentos?: string[];
  };
}

interface Academia {
  id: number;
  nome: string;
}

interface Equipamento {
  id: number;
  nome: string;
  tipo: string;
}

@Component({
  selector: 'app-plano-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
            <h1 class="text-2xl font-bold">{{ isEdicao ? 'Editar Plano' : 'Novo Plano' }}</h1>
          </div>
        </div>

        <form [formGroup]="planoForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Informações Básicas -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Informações Básicas</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Plano *</label>
                <input 
                  type="text" 
                  formControlName="nome"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="planoForm.get('nome')?.invalid && planoForm.get('nome')?.touched">
                <div *ngIf="planoForm.get('nome')?.invalid && planoForm.get('nome')?.touched" class="text-red-500 text-sm mt-1">
                  Nome é obrigatório
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  formControlName="ativo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option [value]="true">Ativo</option>
                  <option [value]="false">Inativo</option>
                </select>
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <textarea 
                formControlName="descricao"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="planoForm.get('descricao')?.invalid && planoForm.get('descricao')?.touched">
              </textarea>
              <div *ngIf="planoForm.get('descricao')?.invalid && planoForm.get('descricao')?.touched" class="text-red-500 text-sm mt-1">
                Descrição é obrigatória
              </div>
            </div>
          </div>

          <!-- Valores e Duração -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Valores e Duração</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Mensal (R$) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  formControlName="valor"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="planoForm.get('valor')?.invalid && planoForm.get('valor')?.touched">
                <div *ngIf="planoForm.get('valor')?.invalid && planoForm.get('valor')?.touched" class="text-red-500 text-sm mt-1">
                  <span *ngIf="planoForm.get('valor')?.errors?.['required']">Valor é obrigatório</span>
                  <span *ngIf="planoForm.get('valor')?.errors?.['min']">Valor deve ser maior que zero</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Duração (meses) *</label>
                <select 
                  formControlName="duracaoMeses"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="planoForm.get('duracaoMeses')?.invalid && planoForm.get('duracaoMeses')?.touched">
                  <option value="">Selecione a duração</option>
                  <option value="1">1 mês</option>
                  <option value="3">3 meses</option>
                  <option value="6">6 meses</option>
                  <option value="12">12 meses</option>
                  <option value="24">24 meses</option>
                </select>
                <div *ngIf="planoForm.get('duracaoMeses')?.invalid && planoForm.get('duracaoMeses')?.touched" class="text-red-500 text-sm mt-1">
                  Duração é obrigatória
                </div>
              </div>
            </div>
          </div>

          <!-- Benefícios -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Benefícios</h2>
            <div formArrayName="beneficios">
              <div *ngFor="let beneficio of beneficiosArray.controls; let i = index" class="flex items-center mb-2">
                <input 
                  type="text" 
                  [formControlName]="i"
                  placeholder="Digite um benefício"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
                <button 
                  type="button"
                  (click)="removerBeneficio(i)"
                  class="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                  Remover
                </button>
              </div>
            </div>
            <button 
              type="button"
              (click)="adicionarBeneficio()"
              class="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Adicionar Benefício
            </button>
          </div>

          <!-- Limites de Acesso -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Limites de Acesso</h2>
            <div formGroupName="limitesAcesso" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Horários de Funcionamento</label>
                <select 
                  formControlName="horarios"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sem restrição</option>
                  <option value="06:00 às 22:00">06:00 às 22:00</option>
                  <option value="06:00 às 18:00">06:00 às 18:00</option>
                  <option value="08:00 às 20:00">08:00 às 20:00</option>
                  <option value="24 horas">24 horas</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Academias Permitidas</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div *ngFor="let academia of academias" class="flex items-center">
                    <input 
                      type="checkbox" 
                      [value]="academia.id"
                      (change)="onAcademiaChange($event, academia.id)"
                      class="mr-2">
                    <label class="text-sm">{{ academia.nome }}</label>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Equipamentos Permitidos</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div *ngFor="let equipamento of equipamentos" class="flex items-center">
                    <input 
                      type="checkbox" 
                      [value]="equipamento.nome"
                      (change)="onEquipamentoChange($event, equipamento.nome)"
                      class="mr-2">
                    <label class="text-sm">{{ equipamento.nome }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botões -->
          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              (click)="voltar()"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Cancelar
            </button>
            <button 
              type="submit"
              [disabled]="planoForm.invalid || loading"
              class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ loading ? 'Salvando...' : (isEdicao ? 'Atualizar' : 'Criar') }} Plano
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PlanoFormComponent implements OnInit {
  planoForm!: FormGroup;
  isEdicao = false;
  planoId?: number;
  loading = false;
  academias: Academia[] = [];
  equipamentos: Equipamento[] = [];
  academiasPermitidas: number[] = [];
  equipamentosPermitidos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      this.planoId = +id;
      this.carregarPlano();
    }
    this.carregarAcademias();
    this.carregarEquipamentos();
  }

  initForm(): void {
    this.planoForm = this.fb.group({
      nome: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      duracaoMeses: ['', [Validators.required]],
      ativo: [true],
      beneficios: this.fb.array([]),
      limitesAcesso: this.fb.group({
        horarios: [''],
        academias: [[]],
        equipamentos: [[]]
      })
    });

    // Adicionar pelo menos um benefício por padrão
    this.adicionarBeneficio();
  }

  get beneficiosArray(): FormArray {
    return this.planoForm.get('beneficios') as FormArray;
  }

  adicionarBeneficio(): void {
    this.beneficiosArray.push(this.fb.control('', [Validators.required]));
  }

  removerBeneficio(index: number): void {
    if (this.beneficiosArray.length > 1) {
      this.beneficiosArray.removeAt(index);
    }
  }

  onAcademiaChange(event: any, academiaId: number): void {
    if (event.target.checked) {
      this.academiasPermitidas.push(academiaId);
    } else {
      const index = this.academiasPermitidas.indexOf(academiaId);
      if (index > -1) {
        this.academiasPermitidas.splice(index, 1);
      }
    }
    this.planoForm.get('limitesAcesso.academias')?.setValue(this.academiasPermitidas);
  }

  onEquipamentoChange(event: any, equipamentoNome: string): void {
    if (event.target.checked) {
      this.equipamentosPermitidos.push(equipamentoNome);
    } else {
      const index = this.equipamentosPermitidos.indexOf(equipamentoNome);
      if (index > -1) {
        this.equipamentosPermitidos.splice(index, 1);
      }
    }
    this.planoForm.get('limitesAcesso.equipamentos')?.setValue(this.equipamentosPermitidos);
  }

  carregarPlano(): void {
    this.loading = true;
    
    // TODO: Implementar chamada para API
    setTimeout(() => {
      const planoMock: Plano = {
        id: this.planoId,
        nome: 'Plano Premium',
        descricao: 'Acesso completo + aulas coletivas e personal trainer',
        valor: 149.90,
        duracaoMeses: 1,
        ativo: true,
        beneficios: ['Musculação', 'Cardio', 'Aulas Coletivas', 'Personal Trainer'],
        limitesAcesso: {
          horarios: '24 horas',
          academias: [1, 2],
          equipamentos: ['Esteira', 'Bicicleta']
        }
      };
      
      this.preencherForm(planoMock);
      this.loading = false;
    }, 500);
  }

  preencherForm(plano: Plano): void {
    this.planoForm.patchValue({
      nome: plano.nome,
      descricao: plano.descricao,
      valor: plano.valor,
      duracaoMeses: plano.duracaoMeses,
      ativo: plano.ativo,
      limitesAcesso: {
        horarios: plano.limitesAcesso?.horarios || ''
      }
    });

    // Limpar benefícios existentes e adicionar os do plano
    while (this.beneficiosArray.length !== 0) {
      this.beneficiosArray.removeAt(0);
    }
    plano.beneficios.forEach(beneficio => {
      this.beneficiosArray.push(this.fb.control(beneficio, [Validators.required]));
    });

    // Configurar academias e equipamentos permitidos
    this.academiasPermitidas = plano.limitesAcesso?.academias || [];
    this.equipamentosPermitidos = plano.limitesAcesso?.equipamentos || [];
  }

  carregarAcademias(): void {
    // TODO: Implementar chamada para API
    this.academias = [
      { id: 1, nome: 'Academia Central' },
      { id: 2, nome: 'Academia Norte' },
      { id: 3, nome: 'Academia Sul' }
    ];
  }

  carregarEquipamentos(): void {
    // TODO: Implementar chamada para API
    this.equipamentos = [
      { id: 1, nome: 'Esteira', tipo: 'Cardio' },
      { id: 2, nome: 'Bicicleta', tipo: 'Cardio' },
      { id: 3, nome: 'Supino', tipo: 'Musculação' },
      { id: 4, nome: 'Leg Press', tipo: 'Musculação' }
    ];
  }

  onSubmit(): void {
    if (this.planoForm.valid) {
      this.loading = true;
      
      const formData = this.planoForm.value;
      const plano: Plano = {
        ...formData,
        beneficios: formData.beneficios.filter((b: string) => b.trim() !== ''),
        limitesAcesso: {
          ...formData.limitesAcesso,
          academias: this.academiasPermitidas,
          equipamentos: this.equipamentosPermitidos
        }
      };

      // TODO: Implementar chamada para API
      setTimeout(() => {
        console.log('Plano salvo:', plano);
        this.loading = false;
        this.router.navigate(['/planos']);
      }, 1000);
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.planoForm.controls).forEach(key => {
        this.planoForm.get(key)?.markAsTouched();
      });
      this.beneficiosArray.controls.forEach(control => {
        control.markAsTouched();
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/planos']);
  }
}
