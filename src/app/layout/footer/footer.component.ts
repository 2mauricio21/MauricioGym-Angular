import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  version = '1.0.0';
  
  links = [
    {
      label: 'Sobre',
      url: '/about'
    },
    {
      label: 'Suporte',
      url: '/support'
    },
    {
      label: 'Política de Privacidade',
      url: '/privacy'
    },
    {
      label: 'Termos de Uso',
      url: '/terms'
    }
  ];

  socialLinks = [
    {
      label: 'Facebook',
      icon: 'pi pi-facebook',
      url: 'https://facebook.com/mauriciogym'
    },
    {
      label: 'Instagram',
      icon: 'pi pi-instagram',
      url: 'https://instagram.com/mauriciogym'
    },
    {
      label: 'Twitter',
      icon: 'pi pi-twitter',
      url: 'https://twitter.com/mauriciogym'
    },
    {
      label: 'LinkedIn',
      icon: 'pi pi-linkedin',
      url: 'https://linkedin.com/company/mauriciogym'
    }
  ];

  getBuildMonth(): string {
    return (new Date().getMonth() + 1).toString().padStart(2, '0');
  }
}
