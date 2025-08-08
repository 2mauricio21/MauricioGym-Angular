import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="pi pi-server"></i>
        </div>
        <h1 class="error-title">500</h1>
        <h2 class="error-subtitle">Erro Interno do Servidor</h2>
        <p class="error-message">
          Ocorreu um erro interno no servidor. Nossa equipe foi notificada e está trabalhando para resolver o problema.
          Tente novamente em alguns minutos.
        </p>
        <div class="error-actions">
          <p-button 
            label="Tentar Novamente" 
            icon="pi pi-refresh" 
            (onClick)="reload()"
            styleClass="p-button-primary">
          </p-button>
          <p-button 
            label="Voltar ao Dashboard" 
            icon="pi pi-home" 
            routerLink="/dashboard"
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
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
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
      color: #f39c12;
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
export class ServerErrorComponent {
  reload(): void {
    window.location.reload();
  }
}