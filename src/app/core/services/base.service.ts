import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {

  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Dados inválidos';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflito de dados';
          break;
        case 422:
          errorMessage = error.error?.message || 'Dados inválidos';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.error?.message || error.message}`;
      }
    }
    
    console.error('Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  protected formatDate(date: Date | string): string {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  protected formatDateTime(date: Date | string): string {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toISOString();
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  protected formatCpf(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  protected formatCnpj(cnpj: string): string {
    if (!cnpj) return '';
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  protected formatPhone(phone: string): string {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  }

  protected formatCep(cep: string): string {
    if (!cep) return '';
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
}
  