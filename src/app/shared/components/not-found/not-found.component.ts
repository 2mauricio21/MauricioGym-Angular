import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <h1 class="error-title">404</h1>
        <h2 class="error-subtitle">Página não encontrada</h2>
        <p class="error-message">
          A página que você está procurando não existe ou foi movida.
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      color: #ff6b6b;
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
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}
