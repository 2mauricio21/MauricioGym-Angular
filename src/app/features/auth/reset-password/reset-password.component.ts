import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';
import { ResetPasswordConfirmRequest } from '../../../core/models';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    CardModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  loading = false;
  token: string | null = null;
  email: string | null = null;
  isValidToken = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.extractTokenFromUrl();
    this.createForm();
  }

  private extractTokenFromUrl(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      
      if (!this.token || !this.email) {
        this.isValidToken = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Link Inválido',
          detail: 'O link de redefinição de senha é inválido ou expirou.'
        });
      }
    });
  }

  private createForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
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
    if (!this.isValidToken) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Token inválido. Solicite um novo link de redefinição.'
      });
      return;
    }

    if (this.resetPasswordForm.valid && this.token && this.email) {
      this.loading = true;
      
      const resetRequest: ResetPasswordConfirmRequest = {
        email: this.email,
        token: this.token,
        newPassword: this.resetPasswordForm.value.password
      };

      this.authService.resetPasswordConfirm(resetRequest).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Senha redefinida com sucesso! Você pode fazer login com sua nova senha.'
          });
          
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.message || 'Erro ao redefinir senha. O link pode ter expirado.'
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.resetPasswordForm.controls).forEach(key => {
      const control = this.resetPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.resetPasswordForm.get(fieldName);
    
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    
    // Verificar erro de confirmação de senha
    if (fieldName === 'confirmPassword' && this.resetPasswordForm.errors?.['passwordMismatch']) {
      return 'As senhas não coincidem';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      password: 'Senha',
      confirmPassword: 'Confirmação de Senha'
    };
    return labels[fieldName] || fieldName;
  }

  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onRequestNewLink(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
