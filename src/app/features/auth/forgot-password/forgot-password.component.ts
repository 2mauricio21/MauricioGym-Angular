import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';
import { ResetPasswordRequest } from '../../../core/models';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  emailSent = false;

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
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      
      const resetRequest: ResetPasswordRequest = {
        email: this.forgotPasswordForm.value.email
      };

      this.authService.resetPassword(resetRequest).subscribe({
        next: (response) => {
          this.loading = false;
          this.emailSent = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Email Enviado',
            detail: 'Instruções para redefinir sua senha foram enviadas para seu email.'
          });
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.message || 'Erro ao enviar email de recuperação. Tente novamente.'
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.forgotPasswordForm.get(fieldName);
    
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Email é obrigatório';
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
    }
    
    return '';
  }

  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onResendEmail(): void {
    this.emailSent = false;
    this.onSubmit();
  }
}
