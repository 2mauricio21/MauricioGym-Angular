import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Acesso {
  id: number;
  usuarioId: number;
  academiaId: number;
  dataHora: Date;
  tipo: 'entrada' | 'saida';
  equipamentoId?: number;
  validado: boolean;
  observacoes?: string;
  ipOrigem?: string;
  dispositivoId?: string;
}

interface MeuAcesso {
  id: number;
  dataHora: Date;
  tipo: 'entrada' | 'saida';
  academia: string;
  equipamento?: string;
  observacoes?: string;
}

interface RegistrarAcessoRequest {
  usuarioId: number;
  academiaId: number;
  tipo: 'entrada' | 'saida';
  equipamentoId?: number;
  observacoes?: string;
}

interface EstatisticasAcesso {
  totalAcessos: number;
  acessosHoje: number;
  acessosEstaSemana: number;
  acessosEsteMes: number;
  mediaAcessosDiarios: number;
}

@Injectable({
  providedIn: 'root'
})
export class AcessoService {
  private readonly apiUrl = `${environment.apiUrl}/acessos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Acesso[]> {
    return this.http.get<Acesso[]>(this.apiUrl);
  }

  obterPorId(id: number): Observable<Acesso> {
    return this.http.get<Acesso>(`${this.apiUrl}/${id}`);
  }

  registrarAcesso(acesso: RegistrarAcessoRequest): Observable<Acesso> {
    return this.http.post<Acesso>(`${this.apiUrl}/registrar`, acesso);
  }

  validarAcesso(id: number): Observable<Acesso> {
    return this.http.patch<Acesso>(`${this.apiUrl}/${id}/validar`, {});
  }

  obterMeusAcessos(): Observable<MeuAcesso[]> {
    return this.http.get<MeuAcesso[]>(`${this.apiUrl}/meus-acessos`);
  }

  obterAcessosPorUsuario(usuarioId: number): Observable<Acesso[]> {
    return this.http.get<Acesso[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  obterAcessosPorAcademia(academiaId: number): Observable<Acesso[]> {
    return this.http.get<Acesso[]>(`${this.apiUrl}/academia/${academiaId}`);
  }

  obterAcessosPorPeriodo(dataInicio: Date, dataFim: Date): Observable<Acesso[]> {
    const params = {
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString()
    };
    return this.http.get<Acesso[]>(`${this.apiUrl}/periodo`, { params });
  }

  obterEstatisticas(): Observable<EstatisticasAcesso> {
    return this.http.get<EstatisticasAcesso>(`${this.apiUrl}/estatisticas`);
  }

  obterEstatisticasPorUsuario(usuarioId: number): Observable<EstatisticasAcesso> {
    return this.http.get<EstatisticasAcesso>(`${this.apiUrl}/estatisticas/usuario/${usuarioId}`);
  }

  obterEstatisticasPorAcademia(academiaId: number): Observable<EstatisticasAcesso> {
    return this.http.get<EstatisticasAcesso>(`${this.apiUrl}/estatisticas/academia/${academiaId}`);
  }

  obterAcessosRecentes(limite: number = 10): Observable<Acesso[]> {
    return this.http.get<Acesso[]>(`${this.apiUrl}/recentes?limite=${limite}`);
  }

  obterAcessosNaoValidados(): Observable<Acesso[]> {
    return this.http.get<Acesso[]>(`${this.apiUrl}/nao-validados`);
  }
}