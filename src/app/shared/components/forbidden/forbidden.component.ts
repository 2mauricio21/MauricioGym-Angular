import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="pi pi-ban"></i>
        </div>
        <h1 class="error-title">403</h1>
        <h2 class="error-subtitle">Acesso Negado</h2>
        <p class="error-message">
          Você não tem permissão para acessar esta página ou recurso.
          Entre em contato com o administrador se acredita que isso é um erro.
        </p>
        <div class="error-actions">
          <p-button 
            label="Voltar ao Dashboard" 
            icon="pi pi-home" 
            routerLink="/dashboard"
            styleClass="p-button-primary">
          </p-button>
          <p-button 
            label="Voltar" 
            icon="pi pi-arrow-left" 
            (onClick)="goBack()"
            styleClass="p-button-outlined ml-2">
          </p-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      padding: 2rem;
    }

    .error-content {
      text-align: center;
      background: white;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 100%;
    }

    .error-icon {
      font-size: 4rem;
      color: #e74c3c;
      margin-bottom: 1rem;
    }

    .error-title {
      font-size: 6rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 0;
      line-height: 1;
    }

    .error-subtitle {
      font-size: 1.5rem;
      color: #34495e;
      margin: 1rem 0;
      font-weight: 600;
    }

    .error-message {
      color: #7f8c8d;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .error-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .error-container {
        padding: 1rem;
      }
      
      .error-content {
        padding: 2rem;
      }
      
      .error-title {
        font-size: 4rem;
      }
      
      .error-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ForbiddenComponent {
  goBack(): void {
    window.history.back();
  }
}
