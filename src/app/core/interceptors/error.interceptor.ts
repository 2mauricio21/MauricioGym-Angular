import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado';
      
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || error.error?.erro || 'Dados inválidos';
          break;
        case 401:
          errorMessage = 'Sessão expirada. Faça login novamente';
          // Remove token do localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.navigate(['/auth/login']);
          break;
        case 403:
          errorMessage = 'Acesso negado. Você não tem permissão para esta ação';
          router.navigate(['/403']);
          break;
        case 404:
          errorMessage = 'Recurso não encontrado';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde';
          router.navigate(['/500']);
          break;
        case 0:
          errorMessage = 'Erro de conexão. Verifique sua internet';
          break;
        default:
          errorMessage = error.error?.message || error.message || 'Erro desconhecido';
      }

      // Exibir toast de erro
      messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
        life: 5000
      });

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: error.url,
        error: error.error
      });

      return throwError(() => error);
    })
  );
};
