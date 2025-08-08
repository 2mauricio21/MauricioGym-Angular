import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseService } from './base.service';
import { ApiResponse } from '../models';

export interface FormaPagamento {
  idFormaPagamento: number;
  nome: string;
  descricao: string;
  codigo: string;
  taxaProcessamento?: number;
  diasParaCompensacao?: number;
  ativo: boolean;
  permiteParcelamento: boolean;
  maxParcelas?: number;
  dataCriacao: Date;
  dataAtualizacao?: Date;
}

export interface CreateFormaPagamentoRequest {
  nome: string;
  descricao: string;
  codigo: string;
  taxaProcessamento?: number;
  diasParaCompensacao?: number;
  permiteParcelamento: boolean;
  maxParcelas?: number;
}

export interface UpdateFormaPagamentoRequest {
  idFormaPagamento: number;
  nome: string;
  descricao: string;
  codigo: string;
  taxaProcessamento?: number;
  diasParaCompensacao?: number;
  ativo: boolean;
  permiteParcelamento: boolean;
  maxParcelas?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService extends BaseService {
  private readonly apiUrl = environment.apiUrls.pagamento;

  constructor(private http: HttpClient) {
    super();
  }

  incluirFormaPagamento(formaPagamento: CreateFormaPagamentoRequest): Observable<ApiResponse<FormaPagamento>> {
    return this.http.post<ApiResponse<FormaPagamento>>(`${this.apiUrl}/formas-pagamento`, formaPagamento)
      .pipe(catchError(this.handleError));
  }

  alterarFormaPagamento(formaPagamento: UpdateFormaPagamentoRequest): Observable<ApiResponse<FormaPagamento>> {
    return this.http.put<ApiResponse<FormaPagamento>>(`${this.apiUrl}/formas-pagamento/${formaPagamento.idFormaPagamento}`, formaPagamento)
      .pipe(catchError(this.handleError));
  }

  excluirFormaPagamento(idFormaPagamento: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/formas-pagamento/${idFormaPagamento}`)
      .pipe(catchError(this.handleError));
  }

  consultarFormaPagamento(idFormaPagamento: number): Observable<ApiResponse<FormaPagamento>> {
    return this.http.get<ApiResponse<FormaPagamento>>(`${this.apiUrl}/formas-pagamento/${idFormaPagamento}`)
      .pipe(catchError(this.handleError));
  }

  consultarFormaPagamentoPorCodigo(codigo: string): Observable<ApiResponse<FormaPagamento>> {
    return this.http.get<ApiResponse<FormaPagamento>>(`${this.apiUrl}/formas-pagamento/codigo/${codigo}`)
      .pipe(catchError(this.handleError));
  }

  listarFormasPagamento(): Observable<ApiResponse<FormaPagamento[]>> {
    return this.http.get<ApiResponse<FormaPagamento[]>>(`${this.apiUrl}/formas-pagamento`)
      .pipe(catchError(this.handleError));
  }

  listarFormasPagamentoAtivas(): Observable<ApiResponse<FormaPagamento[]>> {
    return this.http.get<ApiResponse<FormaPagamento[]>>(`${this.apiUrl}/formas-pagamento/ativas`)
      .pipe(catchError(this.handleError));
  }

  listarFormasPagamentoComParcelamento(): Observable<ApiResponse<FormaPagamento[]>> {
    return this.http.get<ApiResponse<FormaPagamento[]>>(`${this.apiUrl}/formas-pagamento/parcelamento`)
      .pipe(catchError(this.handleError));
  }

  alterarStatusFormaPagamento(idFormaPagamento: number, ativo: boolean): Observable<ApiResponse<FormaPagamento>> {
    return this.http.patch<ApiResponse<FormaPagamento>>(`${this.apiUrl}/formas-pagamento/${idFormaPagamento}/status`, { ativo })
      .pipe(catchError(this.handleError));
  }

  // Métodos para cálculos
  calcularTaxaProcessamento(idFormaPagamento: number, valor: number): Observable<ApiResponse<{ valorTaxa: number; valorLiquido: number }>> {
    const params = new HttpParams().set('valor', valor.toString());
    return this.http.get<ApiResponse<{ valorTaxa: number; valorLiquido: number }>>(`${this.apiUrl}/formas-pagamento/${idFormaPagamento}/calcular-taxa`, { params })
      .pipe(catchError(this.handleError));
  }

  calcularParcelamento(idFormaPagamento: number, valor: number, parcelas: number): Observable<ApiResponse<{
    valorParcela: number;
    valorTotal: number;
    juros: number;
    parcelas: Array<{ numero: number; valor: number; vencimento: Date }>;
  }>> {
    const params = new HttpParams()
      .set('valor', valor.toString())
      .set('parcelas', parcelas.toString());
    
    return this.http.get<ApiResponse<{
      valorParcela: number;
      valorTotal: number;
      juros: number;
      parcelas: Array<{ numero: number; valor: number; vencimento: Date }>;
    }>>(`${this.apiUrl}/formas-pagamento/${idFormaPagamento}/calcular-parcelamento`, { params })
      .pipe(catchError(this.handleError));
  }

  // Métodos para relatórios
  obterEstatisticasFormaPagamento(params: {
    dataInicio?: string;
    dataFim?: string;
    idAcademia?: number;
  } = {}): Observable<ApiResponse<{
    totalTransacoes: number;
    valorTotal: number;
    formasMaisUsadas: Array<{ formaPagamento: string; quantidade: number; percentual: number }>;
    taxasArrecadadas: number;
  }>> {
    let httpParams = new HttpParams();
    
    if (params.dataInicio) httpParams = httpParams.set('dataInicio', params.dataInicio);
    if (params.dataFim) httpParams = httpParams.set('dataFim', params.dataFim);
    if (params.idAcademia) httpParams = httpParams.set('idAcademia', params.idAcademia.toString());
    
    return this.http.get<ApiResponse<{
      totalTransacoes: number;
      valorTotal: number;
      formasMaisUsadas: Array<{ formaPagamento: string; quantidade: number; percentual: number }>;
      taxasArrecadadas: number;
    }>>(`${this.apiUrl}/formas-pagamento/estatisticas`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  // Métodos para validação
  validarFormaPagamento(idFormaPagamento: number, valor: number, parcelas?: number): Observable<ApiResponse<{
    valida: boolean;
    mensagem?: string;
    limiteParcelas?: number;
    valorMinimo?: number;
    valorMaximo?: number;
  }>> {
    let params = new HttpParams().set('valor', valor.toString());
    if (parcelas) params = params.set('parcelas', parcelas.toString());
    
    return this.http.get<ApiResponse<{
      valida: boolean;
      mensagem?: string;
      limiteParcelas?: number;
      valorMinimo?: number;
      valorMaximo?: number;
    }>>(`${this.apiUrl}/formas-pagamento/${idFormaPagamento}/validar`, { params })
      .pipe(catchError(this.handleError));
  }
}