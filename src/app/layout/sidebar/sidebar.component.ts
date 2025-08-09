import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { UserInfo, TipoUsuario } from '../../core/models';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
  roles?: TipoUsuario[];
  badge?: string;
  badgeClass?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: '0', opacity: '0', overflow: 'hidden' }),
        animate('300ms ease-in-out', style({ height: '*', opacity: '1' }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: '1', overflow: 'hidden' }),
        animate('300ms ease-in-out', style({ height: '0', opacity: '0' }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {
  @Input() visible = true;
  @Input() currentUser: UserInfo | null = null;
  @Input() isMobile = false;
  @Output() sidebarHide = new EventEmitter<void>();

  currentRoute = '';
  menuItems: MenuItem[] = [];

  constructor(private router: Router) {
    // Observar mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
        }
      });
  }

  ngOnInit(): void {
    this.initMenuItems();
    this.currentRoute = this.router.url;
  }

  private initMenuItems(): void {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/dashboard'
      },
      {
        label: 'Usuários',
        icon: 'pi pi-users',
        route: '/usuarios',
        roles: [TipoUsuario.Administrador, TipoUsuario.Funcionario]
      },
      {
        label: 'Academias',
        icon: 'pi pi-building',
        route: '/academias',
        roles: [TipoUsuario.Administrador, TipoUsuario.Funcionario]
      },
      {
        label: 'Planos',
        icon: 'pi pi-credit-card',
        children: [
          {
            label: 'Gerenciar Planos',
            icon: 'pi pi-list',
            route: '/planos',
            roles: [TipoUsuario.Administrador, TipoUsuario.Funcionario]
          },
          {
            label: 'Meus Planos',
            icon: 'pi pi-user',
            route: '/meus-planos',
            roles: [TipoUsuario.Cliente]
          }
        ]
      },
      {
        label: 'Pagamentos',
        icon: 'pi pi-dollar',
        children: [
          {
            label: 'Gerenciar Pagamentos',
            icon: 'pi pi-list',
            route: '/pagamentos',
            roles: [TipoUsuario.Administrador, TipoUsuario.Funcionario]
          },
          {
            label: 'Meus Pagamentos',
            icon: 'pi pi-wallet',
            route: '/meus-pagamentos',
            roles: [TipoUsuario.Cliente]
          }
        ]
      },
      {
        label: 'Controle de Acesso',
        icon: 'pi pi-key',
        children: [
          {
            label: 'Acessos',
            icon: 'pi pi-sign-in',
            route: '/acessos',
            roles: [TipoUsuario.Administrador, TipoUsuario.Funcionario]
          },
          {
            label: 'Bloqueios',
            icon: 'pi pi-ban',
            route: '/bloqueios',
            roles: [TipoUsuario.Administrador, TipoUsuario.Funcionario]
          },
          {
            label: 'Meus Acessos',
            icon: 'pi pi-history',
            route: '/meus-acessos',
            roles: [TipoUsuario.Cliente]
          }
        ]
      },
      {
        label: 'Relatórios',
        icon: 'pi pi-chart-bar',
        children: [
          {
            label: 'Usuários',
            icon: 'pi pi-users',
            route: '/relatorios/usuarios',
            roles: [TipoUsuario.Administrador]
          },
          {
            label: 'Academias',
            icon: 'pi pi-building',
            route: '/relatorios/academias',
            roles: [TipoUsuario.Administrador]
          },
          {
            label: 'Financeiro',
            icon: 'pi pi-dollar',
            route: '/relatorios/financeiro',
            roles: [TipoUsuario.Administrador]
          },
          {
            label: 'Acessos',
            icon: 'pi pi-sign-in',
            route: '/relatorios/acessos',
            roles: [TipoUsuario.Administrador, TipoUsuario.Funcionario]
          }
        ],
        roles: [TipoUsuario.Administrador, TipoUsuario.Funcionario]
      },
      {
        label: 'Configurações',
        icon: 'pi pi-cog',
        children: [
          {
            label: 'Perfil',
            icon: 'pi pi-user',
            route: '/profile'
          },
          {
            label: 'Sistema',
            icon: 'pi pi-cog',
            route: '/settings',
            roles: [TipoUsuario.Administrador]
          }
        ]
      }
    ];
  }

  hasPermission(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    
    if (!this.currentUser?.tipoUsuario) {
      return false;
    }
    
    return item.roles.includes(this.currentUser.tipoUsuario as TipoUsuario);
  }

  isRouteActive(route: string): boolean {
    if (!route) return false;
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  isParentActive(item: MenuItem): boolean {
    if (!item.children) return false;
    
    return item.children.some(child => 
      child.route && this.isRouteActive(child.route)
    );
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
      
      // Fechar sidebar no mobile após navegação
      if (this.isMobile) {
        this.sidebarHide.emit();
      }
    }
  }

  onMenuItemClick(item: MenuItem): void {
    if (item.route) {
      this.navigateTo(item.route);
    } else if (item.children) {
      this.toggleSubmenu(item);
    }
  }
}
