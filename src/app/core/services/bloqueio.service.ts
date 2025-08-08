import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Bloqueio {
  id: number;
  usuarioId: number;
  nomeUsuario: string;
  emailUsuario: string;
  motivo: string;
  dataInicio: Date;
  dataFim?: Date;
  ativo: boolean;
  dataCriacao: Date;
  dataAtualizacao?: Date;
}

interface CriarBloqueioRequest {
  usuarioId: number;
  motivo: string;
  dataInicio: Date;
  dataFim?: Date;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BloqueioService {
  private readonly apiUrl = `${environment.apiUrl}/bloqueios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Bloqueio[]> {
    return this.http.get<Bloqueio[]>(this.apiUrl);
  }

  obterPorId(id: number): Observable<Bloqueio> {
    return this.http.get<Bloqueio>(`${this.apiUrl}/${id}`);
  }

  criar(bloqueio: CriarBloqueioRequest): Observable<Bloqueio> {
    return this.http.post<Bloqueio>(this.apiUrl, bloqueio);
  }

  atualizar(id: number, bloqueio: Partial<CriarBloqueioRequest>): Observable<Bloqueio> {
    return this.http.put<Bloqueio>(`${this.apiUrl}/${id}`, bloqueio);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  ativar(id: number): Observable<Bloqueio> {
    return this.http.patch<Bloqueio>(`${this.apiUrl}/${id}/ativar`, {});
  }

  desativar(id: number): Observable<Bloqueio> {
    return this.http.patch<Bloqueio>(`${this.apiUrl}/${id}/desativar`, {});
  }

  listarPorUsuario(usuarioId: number): Observable<Bloqueio[]> {
    return this.http.get<Bloqueio[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  listarAtivos(): Observable<Bloqueio[]> {
    return this.http.get<Bloqueio[]>(`${this.apiUrl}/ativos`);
  }
}