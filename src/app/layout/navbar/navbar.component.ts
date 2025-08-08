import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { UserInfo } from '../../core/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    AvatarModule,
    BadgeModule,
    OverlayPanelModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() currentUser: UserInfo | null = null;
  @Input() sidebarVisible = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  userMenuItems: MenuItem[] = [];
  notificationCount = 3; // Exemplo - será implementado com dados reais

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.initUserMenu();
  }

  private initUserMenu(): void {
    this.userMenuItems = [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => this.goToProfile()
      },
      {
        label: 'Configurações',
        icon: 'pi pi-cog',
        command: () => this.goToSettings()
      },
      {
        separator: true
      },
      {
        label: 'Alterar Senha',
        icon: 'pi pi-key',
        command: () => this.changePassword()
      },
      {
        separator: true
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout()
      }
    ];
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  getUserInitials(): string {
    if (!this.currentUser?.nomeCompleto) return 'U';
    
    const names = this.currentUser.nomeCompleto.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  getUserRoleLabel(): string {
    switch (this.currentUser?.tipoUsuario?.toLowerCase()) {
      case 'administrador':
        return 'Administrador';
      case 'funcionario':
        return 'Funcionário';
      case 'cliente':
        return 'Cliente';
      default:
        return 'Usuário';
    }
  }

  getUserRoleColor(): string {
    switch (this.currentUser?.tipoUsuario?.toLowerCase()) {
      case 'administrador':
        return '#ef4444';
      case 'funcionario':
        return '#f59e0b';
      case 'cliente':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  changePassword(): void {
    this.router.navigate(['/change-password']);
  }

  goToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  onLogout(): void {
    this.authService.signOut();
  }

  goToHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
