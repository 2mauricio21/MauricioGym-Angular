import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { LoadingService } from './core/services/loading.service';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToastModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MauricioGym';
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initializePrimeNG();
    this.initializeAuth();
    this.subscribeToLoading();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializePrimeNG(): void {
    // Configurações do PrimeNG
    this.primengConfig.ripple = true;
    this.primengConfig.inputStyle.set('outlined');
    
    // Configurações de localização (português brasileiro)
    this.primengConfig.setTranslation({
      accept: 'Sim',
      reject: 'Não',
      choose: 'Escolher',
      upload: 'Enviar',
      cancel: 'Cancelar',
      clear: 'Limpar',

      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sá'],
      monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ],
      monthNamesShort: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ],
      today: 'Hoje',
      weekHeader: 'Sem',
      firstDayOfWeek: 0,
      dateFormat: 'dd/mm/yy',
      weak: 'Fraco',
      medium: 'Médio',
      strong: 'Forte',
      passwordPrompt: 'Digite uma senha',
      emptyFilterMessage: 'Nenhum resultado encontrado',
      emptyMessage: 'Nenhum dado disponível',
      aria: {
        trueLabel: 'Verdadeiro',
        falseLabel: 'Falso',
        nullLabel: 'Não selecionado',
        star: '1 estrela',
        stars: '{star} estrelas',
        selectAll: 'Todos os itens selecionados',
        unselectAll: 'Todos os itens desmarcados',
        close: 'Fechar',
        previous: 'Anterior',
        next: 'Próximo',
        navigation: 'Navegação',
        scrollTop: 'Rolar para o topo',
        moveTop: 'Mover para o topo',
        moveUp: 'Mover para cima',
        moveDown: 'Mover para baixo',
        moveBottom: 'Mover para baixo',
        moveToTarget: 'Mover para o destino',
        moveToSource: 'Mover para a origem',
        moveAllToTarget: 'Mover todos para o destino',
        moveAllToSource: 'Mover todos para a origem',
        pageLabel: 'Página {page}',
        firstPageLabel: 'Primeira página',
        lastPageLabel: 'Última página',
        nextPageLabel: 'Próxima página',
        prevPageLabel: 'Página anterior',
        rowsPerPageLabel: 'Linhas por página',
        jumpToPageDropdownLabel: 'Ir para a página',
        jumpToPageInputLabel: 'Ir para a página',
        selectRow: 'Linha selecionada',
        unselectRow: 'Linha desmarcada',
        expandRow: 'Linha expandida',
        collapseRow: 'Linha recolhida',
        showFilterMenu: 'Mostrar menu de filtro',
        hideFilterMenu: 'Ocultar menu de filtro',
        filterOperator: 'Operador de filtro',
        filterConstraint: 'Restrição de filtro',
        editRow: 'Editar linha',
        saveEdit: 'Salvar edição',
        cancelEdit: 'Cancelar edição',
        listView: 'Visualização em lista',
        gridView: 'Visualização em grade',
        slide: 'Slide',
        slideNumber: '{slideNumber}',
        zoomImage: 'Ampliar imagem',
        zoomIn: 'Ampliar',
        zoomOut: 'Reduzir',
        rotateRight: 'Girar à direita',
        rotateLeft: 'Girar à esquerda'
      }
    });
  }

  private initializeAuth(): void {
    // Verificar se há token salvo e tentar fazer login automático
    this.authService.initializeAuth();
  }

  private subscribeToLoading(): void {
    this.loadingService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }
}
