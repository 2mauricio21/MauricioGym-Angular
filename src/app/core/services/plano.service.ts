import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseService } from './base.service';
import { Plano, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlanoService extends BaseService {
  private readonly apiUrl = environment.apiUrls.plano;

  constructor(private http: HttpClient) {
    super();
  }

  incluirPlano(plano: Partial<Plano>): Observable<ApiResponse<Plano>> {
    return this.http.post<ApiResponse<Plano>>(this.apiUrl, plano)
      .pipe(catchError(this.handleError));
  }

  alterarPlano(plano: Plano): Observable<ApiResponse<Plano>> {
    return this.http.put<ApiResponse<Plano>>(`${this.apiUrl}/${plano.idPlano}`, plano)
      .pipe(catchError(this.handleError));
  }

  cancelarPlano(idPlano: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${idPlano}`)
      .pipe(catchError(this.handleError));
  }

  consultarPlano(idPlano: number): Observable<ApiResponse<Plano>> {
    return this.http.get<ApiResponse<Plano>>(`${this.apiUrl}/${idPlano}`)
      .pipe(catchError(this.handleError));
  }

  listarPlanos(): Observable<ApiResponse<Plano[]>> {
    return this.http.get<ApiResponse<Plano[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listarPlanosPorAcademia(idAcademia: number): Observable<ApiResponse<Plano[]>> {
    return this.http.get<ApiResponse<Plano[]>>(`${this.apiUrl}/academia/${idAcademia}`)
      .pipe(catchError(this.handleError));
  }

  // Métodos específicos para gestão
  obterPlanosAtivos(idAcademia?: number): Observable<ApiResponse<Plano[]>> {
    let params = new HttpParams();
    params = params.set('ativos', 'true');
    if (idAcademia) params = params.set('idAcademia', idAcademia.toString());
    
    return this.http.get<ApiResponse<Plano[]>>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  obterPlanosPopulares(limite: number = 5, idAcademia?: number): Observable<ApiResponse<Plano[]>> {
    let params = new HttpParams();
    params = params.set('limite', limite.toString());
    if (idAcademia) params = params.set('idAcademia', idAcademia.toString());
    
    return this.http.get<ApiResponse<Plano[]>>(`${this.apiUrl}/populares`, { params })
      .pipe(catchError(this.handleError));
  }

  // Métodos para estatísticas
  obterEstatisticasPlano(idAcademia?: number): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (idAcademia) params = params.set('idAcademia', idAcademia.toString());
    
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/estatisticas`, { params })
      .pipe(catchError(this.handleError));
  }

  obterRelatorioPlanos(reportParams: {
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

  // Métodos para validação
  validarDisponibilidadePlano(nomePlano: string, idAcademia: number, idPlano?: number): Observable<ApiResponse<boolean>> {
    let params = new HttpParams();
    params = params.set('nome', nomePlano);
    params = params.set('idAcademia', idAcademia.toString());
    if (idPlano) params = params.set('idPlano', idPlano.toString());
    
    return this.http.get<ApiResponse<boolean>>(`${this.apiUrl}/validar-disponibilidade`, { params })
      .pipe(catchError(this.handleError));
  }
}