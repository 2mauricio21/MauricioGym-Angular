import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseService } from './base.service';
import { Pagamento, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService extends BaseService {
  private readonly apiUrl = environment.apiUrls.pagamento;

  constructor(private http: HttpClient) {
    super();
  }

  incluirPagamento(pagamento: Partial<Pagamento>): Observable<ApiResponse<Pagamento>> {
    return this.http.post<ApiResponse<Pagamento>>(this.apiUrl, pagamento)
      .pipe(catchError(this.handleError));
  }

  alterarPagamento(pagamento: Pagamento): Observable<ApiResponse<Pagamento>> {
    return this.http.put<ApiResponse<Pagamento>>(`${this.apiUrl}/${pagamento.idPagamento}`, pagamento)
      .pipe(catchError(this.handleError));
  }

  cancelarPagamento(idPagamento: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${idPagamento}`)
      .pipe(catchError(this.handleError));
  }

  consultarPagamento(idPagamento: number): Observable<ApiResponse<Pagamento>> {
    return this.http.get<ApiResponse<Pagamento>>(`${this.apiUrl}/${idPagamento}`)
      .pipe(catchError(this.handleError));
  }

  listarPagamentos(): Observable<ApiResponse<Pagamento[]>> {
    return this.http.get<ApiResponse<Pagamento[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listarPagamentosPorUsuario(idUsuario: number): Observable<ApiResponse<Pagamento[]>> {
    return this.http.get<ApiResponse<Pagamento[]>>(`${this.apiUrl}/usuario/${idUsuario}`)
      .pipe(catchError(this.handleError));
  }

  listarPagamentosPorAcademia(idAcademia: number): Observable<ApiResponse<Pagamento[]>> {
    return this.http.get<ApiResponse<Pagamento[]>>(`${this.apiUrl}/academia/${idAcademia}`)
      .pipe(catchError(this.handleError));
  }

  // Métodos específicos para relatórios
  obterRelatorioFinanceiro(reportParams: {
    dataInicio?: string;
    dataFim?: string;
    idAcademia?: number;
    status?: string;
  }): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    
    if (reportParams.dataInicio) params = params.set('dataInicio', reportParams.dataInicio);
    if (reportParams.dataFim) params = params.set('dataFim', reportParams.dataFim);
    if (reportParams.idAcademia) params = params.set('idAcademia', reportParams.idAcademia.toString());
    if (reportParams.status) params = params.set('status', reportParams.status);
    
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/relatorio`, { params })
      .pipe(catchError(this.handleError));
  }

  obterEstatisticasPagamento(idAcademia?: number): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (idAcademia) params = params.set('idAcademia', idAcademia.toString());
    
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/estatisticas`, { params })
      .pipe(catchError(this.handleError));
  }

  // Métodos para dashboard
  obterPagamentosRecentes(limite: number = 10, idAcademia?: number): Observable<ApiResponse<Pagamento[]>> {
    let params = new HttpParams();
    params = params.set('limite', limite.toString());
    if (idAcademia) params = params.set('idAcademia', idAcademia.toString());
    
    return this.http.get<ApiResponse<Pagamento[]>>(`${this.apiUrl}/recentes`, { params })
      .pipe(catchError(this.handleError));
  }

  obterPagamentosPendentes(idAcademia?: number): Observable<ApiResponse<Pagamento[]>> {
    let params = new HttpParams();
    if (idAcademia) params = params.set('idAcademia', idAcademia.toString());
    
    return this.http.get<ApiResponse<Pagamento[]>>(`${this.apiUrl}/pendentes`, { params })
      .pipe(catchError(this.handleError));
  }
}
