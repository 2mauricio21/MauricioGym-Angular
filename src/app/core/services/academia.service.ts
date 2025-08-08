import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  CreateAcademiaRequest,
  FilterOptions,
  PaginatedResponse,
  UpdateAcademiaRequest,
  Academia
} from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AcademiaService extends BaseService {
  private readonly apiUrl = environment.apiUrls.academia;

  constructor(private http: HttpClient) {
    super();
  }

  listar(filters?: FilterOptions): Observable<PaginatedResponse<Academia>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDirection) params = params.set('sortDirection', filters.sortDirection);
    }

    return this.http.get<PaginatedResponse<Academia>>(`${this.apiUrl}`, { params })
      .pipe(catchError(this.handleError));
  }

  consultar(id: number): Observable<ApiResponse<Academia>> {
    return this.http.get<ApiResponse<Academia>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  incluir(academia: CreateAcademiaRequest): Observable<ApiResponse<Academia>> {
    return this.http.post<ApiResponse<Academia>>(`${this.apiUrl}`, academia)
      .pipe(catchError(this.handleError));
  }

  alterar(academia: UpdateAcademiaRequest): Observable<ApiResponse<Academia>> {
    return this.http.put<ApiResponse<Academia>>(`${this.apiUrl}/${academia.idAcademia}`, academia)
      .pipe(catchError(this.handleError));
  }

  excluir(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  listarAtivas(): Observable<ApiResponse<Academia[]>> {
    return this.http.get<ApiResponse<Academia[]>>(`${this.apiUrl}/ativas`)
      .pipe(catchError(this.handleError));
  }

  alterarStatus(id: number, status: string): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(catchError(this.handleError));
  }

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/estatisticas`)
      .pipe(catchError(this.handleError));
  }

  uploadLogo(id: number, logo: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('logo', logo);
    
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${id}/logo`, formData)
      .pipe(catchError(this.handleError));
  }
}
