import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';

/**
 * Configura o locale padrão da aplicação para português brasileiro
 */
export function configureLocale(): void {
  try {
    // Registrar dados de localização para português brasileiro
    registerLocaleData(localePt, 'pt-BR', localePtExtra);
    
    console.log('✅ Locale configurado para pt-BR');
  } catch (error) {
    console.warn('⚠️ Erro ao configurar locale:', error);
  }
}

/**
 * Configurações de formatação para o Brasil
 */
export const LOCALE_CONFIG = {
  // Formato de data
  dateFormat: 'dd/MM/yyyy',
  dateTimeFormat: 'dd/MM/yyyy HH:mm',
  timeFormat: 'HH:mm',
  
  // Formato de moeda
  currency: 'BRL',
  currencySymbol: 'R$',
  currencyFormat: '¤ #,##0.00',
  
  // Formato de números
  numberFormat: '#,##0.##',
  percentFormat: '#,##0%',
  
  // Separadores
  decimalSeparator: ',',
  thousandSeparator: '.',
  
  // Timezone
  timezone: 'America/Sao_Paulo',
  
  // Idioma
  locale: 'pt-BR',
  language: 'pt'
};

/**
 * Utilitários de formatação
 */
export class LocaleUtils {
  /**
   * Formatar valor monetário
   */
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Formatar data
   */
  static formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR').format(dateObj);
  }

  /**
   * Formatar data e hora
   */
  static formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }

  /**
   * Formatar número
   */
  static formatNumber(value: number, minimumFractionDigits = 0, maximumFractionDigits = 2): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value);
  }

  /**
   * Formatar percentual
   */
  static formatPercent(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(value / 100);
  }

  /**
   * Formatar CPF
   */
  static formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Formatar CNPJ
   */
  static formatCNPJ(cnpj: string): string {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) return cnpj;
    
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  /**
   * Formatar telefone
   */
  static formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  }

  /**
   * Formatar CEP
   */
  static formatCEP(cep: string): string {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return cep;
    
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  /**
   * Remover formatação de string
   */
  static removeFormatting(value: string): string {
    return value.replace(/\D/g, '');
  }

  /**
   * Validar CPF
   */
  static isValidCPF(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, '');
    
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    
    return remainder === parseInt(cleaned.charAt(10));
  }

  /**
   * Validar CNPJ
   */
  static isValidCNPJ(cnpj: string): boolean {
    const cleaned = cnpj.replace(/\D/g, '');
    
    if (cleaned.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cleaned)) return false;
    
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleaned.charAt(i)) * weights1[i];
    }
    
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (digit1 !== parseInt(cleaned.charAt(12))) return false;
    
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleaned.charAt(i)) * weights2[i];
    }
    
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return digit2 === parseInt(cleaned.charAt(13));
  }

  /**
   * Validar email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validar telefone brasileiro
   */
  static isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  }

  /**
   * Validar CEP
   */
  static isValidCEP(cep: string): boolean {
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.length === 8;
  }
}
