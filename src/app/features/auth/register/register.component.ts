import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest, TipoUsuario } from '../../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    DropdownModule,
    CalendarModule,
    InputMaskModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  tiposUsuario = [
    { label: 'Cliente', value: TipoUsuario.Cliente },
    { label: 'Funcionário', value: TipoUsuario.Funcionario },
    { label: 'Administrador', value: TipoUsuario.Administrador }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.registerForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, this.cpfValidator]],
      telefone: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      tipoUsuario: [TipoUsuario.Cliente, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private cpfValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    
    const cpf = control.value.replace(/\D/g, '');
    
    if (cpf.length !== 11) {
      return { cpfInvalid: true };
    }
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { cpfInvalid: true };
    }
    
    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) {
      return { cpfInvalid: true };
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) {
      return { cpfInvalid: true };
    }
    
    return null;
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      
      const formValue = this.registerForm.value;
      const registerRequest: RegisterRequest = {
        nome: formValue.nome,
        nomeCompleto: formValue.nome,
        email: formValue.email,
        cpf: formValue.cpf.replace(/\D/g, ''),
        telefone: formValue.telefone.replace(/\D/g, ''),
        dataNascimento: formValue.dataNascimento,
        tipoUsuario: formValue.tipoUsuario,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword
      };

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cadastro realizado com sucesso! Faça login para continuar.'
          });
          
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.message || 'Erro ao realizar cadastro. Tente novamente.'
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['cpfInvalid']) {
        return 'CPF inválido';
      }
    }
    
    // Verificar erro de confirmação de senha
    if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMismatch']) {
      return 'As senhas não coincidem';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nome: 'Nome',
      email: 'Email',
      cpf: 'CPF',
      telefone: 'Telefone',
      dataNascimento: 'Data de Nascimento',
      tipoUsuario: 'Tipo de Usuário',
      password: 'Senha',
      confirmPassword: 'Confirmação de Senha'
    };
    return labels[fieldName] || fieldName;
  }

  onLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
