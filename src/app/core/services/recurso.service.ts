import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseService } from './base.service';
import { ApiResponse } from '../models';

export interface Recurso {
  idRecurso: number;
  nome: string;
  descricao: string;
  codigo: string;
  ativo: boolean;
  dataCriacao: Date;
  dataAtualizacao?: Date;
}

export interface CreateRecursoRequest {
  nome: string;
  descricao: string;
  codigo: string;
}

export interface UpdateRecursoRequest {
  idRecurso: number;
  nome: string;
  descricao: string;
  codigo: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RecursoService extends BaseService {
  private readonly apiUrl = environment.apiUrls.usuario;

  constructor(private http: HttpClient) {
    super();
  }

  incluirRecurso(recurso: CreateRecursoRequest): Observable<ApiResponse<Recurso>> {
    return this.http.post<ApiResponse<Recurso>>(`${this.apiUrl}/recursos`, recurso)
      .pipe(catchError(this.handleError));
  }

  alterarRecurso(recurso: UpdateRecursoRequest): Observable<ApiResponse<Recurso>> {
    return this.http.put<ApiResponse<Recurso>>(`${this.apiUrl}/recursos/${recurso.idRecurso}`, recurso)
      .pipe(catchError(this.handleError));
  }

  excluirRecurso(idRecurso: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/recursos/${idRecurso}`)
      .pipe(catchError(this.handleError));
  }

  consultarRecurso(idRecurso: number): Observable<ApiResponse<Recurso>> {
    return this.http.get<ApiResponse<Recurso>>(`${this.apiUrl}/recursos/${idRecurso}`)
      .pipe(catchError(this.handleError));
  }

  consultarRecursoPorCodigo(codigo: string): Observable<ApiResponse<Recurso>> {
    return this.http.get<ApiResponse<Recurso>>(`${this.apiUrl}/recursos/codigo/${codigo}`)
      .pipe(catchError(this.handleError));
  }

  listarRecursos(): Observable<ApiResponse<Recurso[]>> {
    return this.http.get<ApiResponse<Recurso[]>>(`${this.apiUrl}/recursos`)
      .pipe(catchError(this.handleError));
  }

  listarRecursosAtivos(): Observable<ApiResponse<Recurso[]>> {
    return this.http.get<ApiResponse<Recurso[]>>(`${this.apiUrl}/recursos/ativos`)
      .pipe(catchError(this.handleError));
  }

  alterarStatusRecurso(idRecurso: number, ativo: boolean): Observable<ApiResponse<Recurso>> {
    return this.http.patch<ApiResponse<Recurso>>(`${this.apiUrl}/recursos/${idRecurso}/status`, { ativo })
      .pipe(catchError(this.handleError));
  }

  // Métodos para verificação de permissões
  verificarPermissaoUsuario(idUsuario: number, codigoRecurso: string): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.apiUrl}/recursos/permissao/${idUsuario}/${codigoRecurso}`)
      .pipe(catchError(this.handleError));
  }

  listarRecursosUsuario(idUsuario: number): Observable<ApiResponse<Recurso[]>> {
    return this.http.get<ApiResponse<Recurso[]>>(`${this.apiUrl}/recursos/usuario/${idUsuario}`)
      .pipe(catchError(this.handleError));
  }

  // Métodos para gerenciamento de recursos por perfil
  listarRecursosPorPerfil(idPerfil: number): Observable<ApiResponse<Recurso[]>> {
    return this.http.get<ApiResponse<Recurso[]>>(`${this.apiUrl}/recursos/perfil/${idPerfil}`)
      .pipe(catchError(this.handleError));
  }

  associarRecursoAoPerfil(idPerfil: number, idRecurso: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/recursos/perfil/${idPerfil}/recurso/${idRecurso}`, {})
      .pipe(catchError(this.handleError));
  }

  desassociarRecursoDoPerfil(idPerfil: number, idRecurso: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/recursos/perfil/${idPerfil}/recurso/${idRecurso}`)
      .pipe(catchError(this.handleError));
  }

  // Métodos para busca e filtros
  buscarRecursos(termo: string): Observable<ApiResponse<Recurso[]>> {
    const params = new HttpParams().set('termo', termo);
    return this.http.get<ApiResponse<Recurso[]>>(`${this.apiUrl}/recursos/buscar`, { params })
      .pipe(catchError(this.handleError));
  }

  listarRecursosPorCategoria(categoria: string): Observable<ApiResponse<Recurso[]>> {
    const params = new HttpParams().set('categoria', categoria);
    return this.http.get<ApiResponse<Recurso[]>>(`${this.apiUrl}/recursos/categoria`, { params })
      .pipe(catchError(this.handleError));
  }
}
