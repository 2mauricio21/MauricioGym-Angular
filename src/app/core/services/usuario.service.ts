import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  CreateUsuarioRequest,
  FilterOptions,
  PaginatedResponse,
  UpdateUsuarioRequest,
  Usuario
} from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService {
  private readonly apiUrl = environment.apiUrls.usuario;

  constructor(private http: HttpClient) {
    super();
  }

  listarUsuarios(filters?: FilterOptions): Observable<PaginatedResponse<Usuario>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDirection) params = params.set('sortDirection', filters.sortDirection);
    }

    return this.http.get<PaginatedResponse<Usuario>>(`${this.apiUrl}`, { params })
      .pipe(catchError(this.handleError));
  }

  consultarUsuario(id: number): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  consultarUsuarioPorCpf(cpf: string): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/cpf/${cpf}`)
      .pipe(catchError(this.handleError));
  }

  consultarUsuarioPorEmail(email: string): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/email/${email}`)
      .pipe(catchError(this.handleError));
  }

  incluirUsuario(usuario: CreateUsuarioRequest): Observable<ApiResponse<Usuario>> {
    return this.http.post<ApiResponse<Usuario>>(`${this.apiUrl}`, usuario)
      .pipe(catchError(this.handleError));
  }

  alterarUsuario(usuario: UpdateUsuarioRequest): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/${usuario.idUsuario}`, usuario)
      .pipe(catchError(this.handleError));
  }

  excluirUsuario(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  listarUsuariosAtivos(): Observable<ApiResponse<Usuario[]>> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.apiUrl}/ativos`)
      .pipe(catchError(this.handleError));
  }

  listarUsuariosPorTipo(tipo: string): Observable<ApiResponse<Usuario[]>> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.apiUrl}/tipo/${tipo}`)
      .pipe(catchError(this.handleError));
  }

  alterarStatusUsuario(id: number, ativo: boolean): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/status`, { ativo })
      .pipe(catchError(this.handleError));
  }

  uploadFotoUsuario(id: number, foto: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('foto', foto);
    
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${id}/foto`, formData)
      .pipe(catchError(this.handleError));
  }

  obterEstatisticasUsuarios(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/estatisticas`)
      .pipe(catchError(this.handleError));
  }
}
