import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { AcademiaService } from '../../core/services/academia.service';
import { PlanoService } from '../../core/services/plano.service';
import { PagamentoService } from '../../core/services/pagamento.service';
import { AcessoService } from '../../core/services/acesso.service';
import { DashboardStats, UserInfo, Usuario, Academia } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ChartModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    SkeletonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: UserInfo | null = null;
  stats: DashboardStats | null = null;
  recentUsers: Usuario[] = [];
  recentAcademias: Academia[] = [];
  loading = true;
  chartData: any;
  chartOptions: any;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private academiaService: AcademiaService,
    private planoService: PlanoService,
    private pagamentoService: PagamentoService,
    private acessoService: AcessoService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.initChart();
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.currentUser = this.authService.getCurrentUser();

    // Carregar estatísticas
    this.loadAllStats();

    // Carregar usuários recentes
    this.usuarioService.listarUsuarios({ page: 1, pageSize: 5 }).subscribe({
      next: (response: any) => {
        this.recentUsers = response.data || [];
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuários recentes:', error);
      }
    });

    // Carregar academias recentes
    this.academiaService.listar({ page: 1, pageSize: 5 }).subscribe({
      next: (response: any) => {
        this.recentAcademias = response.data || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar academias recentes:', error);
        this.loading = false;
      }
    });
  }

  private initChart(): void {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#495057'
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private updateChartData(): void {
    if (this.stats) {
      this.chartData = {
        labels: ['Usuários Ativos', 'Usuários Inativos', 'Academias Ativas', 'Academias Inativas'],
        datasets: [
          {
            data: [
              this.stats.usuariosAtivos,
              this.stats.totalUsuarios - this.stats.usuariosAtivos,
              this.stats.academiasAtivas,
              this.stats.totalAcademias - this.stats.academiasAtivas
            ],
            backgroundColor: [
              '#42A5F5',
              '#FFA726',
              '#66BB6A',
              '#EF5350'
            ],
            hoverBackgroundColor: [
              '#64B5F6',
              '#FFB74D',
              '#81C784',
              '#F44336'
            ]
          }
        ]
      };
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'danger';
      case 'pendente':
        return 'warning';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
      case 'pendente':
        return 'Pendente';
      default:
        return status || 'N/A';
    }
  }

  getTipoUsuarioLabel(tipo: string): string {
    switch (tipo?.toLowerCase()) {
      case 'administrador':
        return 'Admin';
      case 'funcionario':
        return 'Funcionário';
      case 'cliente':
        return 'Cliente';
      default:
        return tipo || 'N/A';
    }
  }

  getTipoUsuarioSeverity(tipo: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (tipo?.toLowerCase()) {
      case 'administrador':
        return 'danger';
      case 'funcionario':
        return 'warning';
      case 'cliente':
        return 'info';
      default:
        return 'secondary';
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  private loadAllStats(): void {
    // Carregar estatísticas de usuários
    this.usuarioService.obterEstatisticasUsuarios().subscribe({
      next: (userStats: any) => {
        const userStatsData = userStats.data || {};
        
        // Carregar estatísticas de academias
        this.academiaService.getStats().subscribe({
          next: (academiaStats: any) => {
            const academiaStatsData = academiaStats.data || {};
            
            // Carregar estatísticas de planos
            this.planoService.obterEstatisticasPlano().subscribe({
              next: (planoStats: any) => {
                const planoStatsData = planoStats.data || {};
                
                // Carregar estatísticas de pagamentos
                this.pagamentoService.obterEstatisticasPagamento().subscribe({
                  next: (pagamentoStats: any) => {
                    const pagamentoStatsData = pagamentoStats.data || {};
                    
                    // Carregar estatísticas de acessos
                    this.acessoService.obterEstatisticas().subscribe({
                      next: (acessoStats: any) => {
                        const acessoStatsData = acessoStats.data || {};
                        
                        this.stats = {
                          totalUsuarios: userStatsData.total || 0,
                          usuariosAtivos: userStatsData.ativos || 0,
                          totalAcademias: academiaStatsData.total || 0,
                          academiasAtivas: academiaStatsData.ativas || 0,
                          totalPlanos: planoStatsData.total || 0,
                          planosAtivos: planoStatsData.ativos || 0,
                          totalPagamentos: pagamentoStatsData.total || 0,
                          pagamentosRecentes: pagamentoStatsData.recentes || 0,
                          acessosHoje: acessoStatsData.hoje || 0,
                          pagamentosVencidos: pagamentoStatsData.vencidos || 0,
                          receitaMensal: pagamentoStatsData.receitaMensal || 0
                        };
                        
                        this.updateChartData();
                        this.loading = false;
                      },
                      error: (error: any) => {
                        console.error('Erro ao carregar estatísticas de acessos:', error);
                        this.loading = false;
                      }
                    });
                  },
                  error: (error: any) => {
                    console.error('Erro ao carregar estatísticas de pagamentos:', error);
                    this.loading = false;
                  }
                });
              },
              error: (error: any) => {
                console.error('Erro ao carregar estatísticas de planos:', error);
                this.loading = false;
              }
            });
          },
          error: (error: any) => {
            console.error('Erro ao carregar estatísticas de academias:', error);
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Erro ao carregar estatísticas de usuários:', error);
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}