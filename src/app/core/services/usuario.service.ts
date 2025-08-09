import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  CreateUsuarioRequest,
  FilterOptions,
  PaginatedResponse,
  UpdateUsuarioRequest,
  Usuario,
  IncluirUsuarioRequestEntity,
  AlterarUsuarioRequestEntity,
  ConsultarUsuarioRequestEntity,
  ExcluirUsuarioRequestEntity,
  UsuarioResponseEntity
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
    const request: ConsultarUsuarioRequestEntity = { idUsuario: id };
    
    return this.http.post<any>(`${this.apiUrl}/consultar`, request)
      .pipe(
        map(response => {
          if (response && response.retorno) {
            const usuarioResponse: UsuarioResponseEntity = response.retorno;
            
            // Converter para formato esperado pelo frontend
            const usuario: Usuario = {
              idUsuario: usuarioResponse.idUsuario,
              nome: usuarioResponse.nome,
              sobrenome: usuarioResponse.sobrenome,
              email: usuarioResponse.email,
              cpf: usuarioResponse.cpf,
              telefone: usuarioResponse.telefone,
              dataNascimento: usuarioResponse.dataNascimento,
              endereco: usuarioResponse.endereco,
              cidade: usuarioResponse.cidade,
              estado: usuarioResponse.estado,
              cep: usuarioResponse.cep,
              ativo: usuarioResponse.ativo,
              dataCadastro: usuarioResponse.dataCadastro,
              dataUltimoLogin: usuarioResponse.dataUltimoLogin,
              nomeCompleto: usuarioResponse.nomeCompleto || `${usuarioResponse.nome} ${usuarioResponse.sobrenome}`
            };
            
            const apiResponse: ApiResponse<Usuario> = {
              success: true,
              data: usuario,
              message: 'Usuário consultado com sucesso'
            };
            
            return apiResponse;
          } else {
            throw new Error('Resposta inválida do servidor');
          }
        }),
        catchError(this.handleError)
      );
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
    const request: IncluirUsuarioRequestEntity = {
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
      senha: usuario.senha,
      cpf: usuario.cpf,
      telefone: usuario.telefone,
      dataNascimento: usuario.dataNascimento,
      endereco: usuario.endereco,
      cidade: usuario.cidade,
      estado: usuario.estado,
      cep: usuario.cep,
      ativo: usuario.ativo ?? true
    };
    
    return this.http.post<any>(`${this.apiUrl}/incluir`, request)
      .pipe(
        map(response => {
          if (response && response.retorno) {
            const usuarioResponse: UsuarioResponseEntity = response.retorno;
            
            // Converter para formato esperado pelo frontend
            const usuarioResult: Usuario = {
              idUsuario: usuarioResponse.idUsuario,
              nome: usuarioResponse.nome,
              sobrenome: usuarioResponse.sobrenome,
              email: usuarioResponse.email,
              cpf: usuarioResponse.cpf,
              telefone: usuarioResponse.telefone,
              dataNascimento: usuarioResponse.dataNascimento,
              endereco: usuarioResponse.endereco,
              cidade: usuarioResponse.cidade,
              estado: usuarioResponse.estado,
              cep: usuarioResponse.cep,
              ativo: usuarioResponse.ativo,
              dataCadastro: usuarioResponse.dataCadastro,
              dataUltimoLogin: usuarioResponse.dataUltimoLogin,
              nomeCompleto: usuarioResponse.nomeCompleto || `${usuarioResponse.nome} ${usuarioResponse.sobrenome}`
            };
            
            const apiResponse: ApiResponse<Usuario> = {
              success: true,
              data: usuarioResult,
              message: 'Usuário incluído com sucesso'
            };
            
            return apiResponse;
          } else {
            throw new Error('Resposta inválida do servidor');
          }
        }),
        catchError(this.handleError)
      );
  }

  alterarUsuario(usuario: UpdateUsuarioRequest): Observable<ApiResponse<Usuario>> {
    const request: AlterarUsuarioRequestEntity = {
      idUsuario: usuario.idUsuario,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
      senha: usuario.senha,
      cpf: usuario.cpf,
      telefone: usuario.telefone,
      dataNascimento: usuario.dataNascimento,
      endereco: usuario.endereco,
      cidade: usuario.cidade,
      estado: usuario.estado,
      cep: usuario.cep,
      ativo: usuario.ativo
    };
    
    return this.http.post<any>(`${this.apiUrl}/alterar`, request)
      .pipe(
        map(response => {
          if (response && response.retorno) {
            const usuarioResponse: UsuarioResponseEntity = response.retorno;
            
            // Converter para formato esperado pelo frontend
            const usuarioResult: Usuario = {
              idUsuario: usuarioResponse.idUsuario,
              nome: usuarioResponse.nome,
              sobrenome: usuarioResponse.sobrenome,
              email: usuarioResponse.email,
              cpf: usuarioResponse.cpf,
              telefone: usuarioResponse.telefone,
              dataNascimento: usuarioResponse.dataNascimento,
              endereco: usuarioResponse.endereco,
              cidade: usuarioResponse.cidade,
              estado: usuarioResponse.estado,
              cep: usuarioResponse.cep,
              ativo: usuarioResponse.ativo,
              dataCadastro: usuarioResponse.dataCadastro,
              dataUltimoLogin: usuarioResponse.dataUltimoLogin,
              nomeCompleto: usuarioResponse.nomeCompleto || `${usuarioResponse.nome} ${usuarioResponse.sobrenome}`
            };
            
            const apiResponse: ApiResponse<Usuario> = {
              success: true,
              data: usuarioResult,
              message: 'Usuário alterado com sucesso'
            };
            
            return apiResponse;
          } else {
            throw new Error('Resposta inválida do servidor');
          }
        }),
        catchError(this.handleError)
      );
  }

  excluirUsuario(id: number): Observable<ApiResponse<any>> {
    const request: ExcluirUsuarioRequestEntity = { idUsuario: id };
    
    return this.http.post<any>(`${this.apiUrl}/excluir`, request)
      .pipe(
        map(response => {
          if (response) {
            const apiResponse: ApiResponse<any> = {
              success: true,
              data: null,
              message: 'Usuário excluído com sucesso'
            };
            
            return apiResponse;
          } else {
            throw new Error('Resposta inválida do servidor');
          }
        }),
        catchError(this.handleError)
      );
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
