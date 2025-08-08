import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Configurações globais
if (typeof window !== 'undefined') {
  // Configurar timezone padrão para o Brasil
  (window as any).Intl = (window as any).Intl || {};
  
  // Configurar locale padrão
  import('./app/core/utils/locale.config').then(({ configureLocale }) => {
    configureLocale();
  });
}

// Bootstrap da aplicação
bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    console.log('🚀 MauricioGym Application started successfully!');
    
    // Log de informações do ambiente
    if (typeof window !== 'undefined') {
      console.log('📱 User Agent:', navigator.userAgent);
      console.log('🌐 Language:', navigator.language);
      console.log('📍 Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  })
  .catch(err => {
    console.error('❌ Error starting MauricioGym Application:', err);
    
    // Mostrar erro amigável para o usuário
    if (typeof document !== 'undefined') {
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          z-index: 9999;
        ">
          <div style="
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            margin: 1rem;
          ">
            <div style="
              font-size: 3rem;
              margin-bottom: 1rem;
            ">⚠️</div>
            <h2 style="
              color: #1f2937;
              margin: 0 0 1rem 0;
              font-size: 1.5rem;
              font-weight: 600;
            ">Erro ao Carregar</h2>
            <p style="
              color: #6b7280;
              margin: 0 0 1.5rem 0;
              line-height: 1.5;
            ">
              Ocorreu um erro ao carregar a aplicação MauricioGym. 
              Por favor, recarregue a página ou entre em contato com o suporte.
            </p>
            <button onclick="window.location.reload()" style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-weight: 500;
              cursor: pointer;
              transition: transform 0.2s ease;
            " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
              🔄 Recarregar Página
            </button>
            <div style="
              margin-top: 1rem;
              font-size: 0.875rem;
              color: #9ca3af;
            ">
              Código do erro: ${err.message || 'Erro desconhecido'}
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(errorDiv);
    }
  });
