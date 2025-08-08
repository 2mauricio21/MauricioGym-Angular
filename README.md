# 🏋️ MauricioGym - Sistema de Gestão de Academia

![Angular](https://img.shields.io/badge/Angular-17.3-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=for-the-badge&logo=bootstrap)
![PrimeNG](https://img.shields.io/badge/PrimeNG-17.18-orange?style=for-the-badge&logo=primeng)

## 📋 Sobre o Projeto

O **MauricioGym** é um sistema completo de gestão de academia desenvolvido em Angular, oferecendo uma interface moderna e intuitiva para gerenciar usuários, planos, pagamentos, acessos e relatórios. O sistema foi projetado para atender às necessidades de academias de todos os tamanhos, proporcionando controle total sobre as operações diárias.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Angular 17.3** - Framework principal
- **TypeScript 5.4** - Linguagem de programação
- **Bootstrap 5.3** - Framework CSS
- **PrimeNG 17.18** - Biblioteca de componentes UI
- **Chart.js 4.4** - Gráficos e visualizações
- **ng2-charts 5.0** - Integração Chart.js com Angular
- **RxJS 7.8** - Programação reativa

### Ferramentas de Desenvolvimento
- **Angular CLI 17.3** - Ferramenta de linha de comando
- **Karma & Jasmine** - Testes unitários
- **TypeScript** - Tipagem estática
- **Prettier** - Formatação de código

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (versão 9 ou superior)
- **Angular CLI** (versão 17 ou superior)

```bash
# Verificar versões instaladas
node --version
npm --version
ng version
```

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/2mauricio21/MauricioGym-Angular.git
cd MauricioGym-Angular
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente**
```bash
# Copie o arquivo de configuração de exemplo
cp src/environments/environment.example.ts src/environments/environment.ts
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm start
# ou
ng serve
```

5. **Acesse a aplicação**
Abra seu navegador e navegue para `http://localhost:4200/`

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── core/                 # Serviços principais, guards, interceptors
│   │   ├── guards/           # Guards de autenticação e autorização
│   │   ├── interceptors/     # Interceptors HTTP
│   │   ├── models/           # Interfaces e modelos de dados
│   │   └── services/         # Serviços da aplicação
│   ├── features/             # Módulos de funcionalidades
│   │   ├── auth/             # Autenticação e autorização
│   │   ├── dashboard/        # Painel principal
│   │   ├── usuarios/         # Gestão de usuários
│   │   ├── academias/        # Gestão de academias
│   │   ├── planos/           # Gestão de planos
│   │   ├── pagamentos/       # Gestão de pagamentos
│   │   ├── acessos/          # Controle de acessos
│   │   └── relatorios/       # Relatórios e analytics
│   ├── layout/               # Componentes de layout
│   │   ├── header/           # Cabeçalho da aplicação
│   │   ├── sidebar/          # Menu lateral
│   │   └── footer/           # Rodapé
│   └── shared/               # Componentes compartilhados
│       ├── components/       # Componentes reutilizáveis
│       ├── directives/       # Diretivas customizadas
│       └── pipes/            # Pipes customizados
├── assets/                   # Recursos estáticos
└── environments/             # Configurações de ambiente
```

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Autorização
- Login seguro com JWT
- Controle de acesso baseado em roles
- Recuperação de senha
- Sessão persistente

### 👥 Gestão de Usuários
- Cadastro e edição de usuários
- Perfis diferenciados (Admin, Funcionário, Cliente)
- Histórico de atividades
- Busca e filtros avançados

### 🏢 Gestão de Academias
- Cadastro de múltiplas unidades
- Configurações por academia
- Horários de funcionamento
- Capacidade e equipamentos

### 💳 Gestão de Planos
- Criação de planos personalizados
- Preços e durações flexíveis
- Planos promocionais
- Histórico de alterações

### 💰 Gestão de Pagamentos
- Controle de mensalidades
- Múltiplas formas de pagamento
- Relatórios financeiros
- Notificações de vencimento

### 🚪 Controle de Acessos
- Registro de entrada/saída
- Bloqueios temporários
- Relatórios de frequência
- Integração com catracas

### 📊 Relatórios e Analytics
- Dashboard com métricas em tempo real
- Relatórios de faturamento
- Análise de frequência
- Gráficos interativos

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia servidor de desenvolvimento
npm run build          # Build de produção
npm run watch          # Build com watch mode
npm test               # Executa testes unitários
npm run lint           # Verifica qualidade do código

# Angular CLI
ng generate component  # Gera novo componente
ng generate service    # Gera novo serviço
ng generate module     # Gera novo módulo
```

## 🌐 Configuração de Ambiente

Configure as variáveis de ambiente em `src/environments/`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  jwtSecret: 'your-jwt-secret',
  // Outras configurações...
};
```

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes e2e
npm run e2e
```

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- 💻 Desktop (1920px+)
- 💻 Laptop (1366px+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Maurício** - [GitHub](https://github.com/2mauricio21)

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

- 🐛 [Reporte bugs](https://github.com/2mauricio21/MauricioGym-Angular/issues)
- 💡 [Solicite features](https://github.com/2mauricio21/MauricioGym-Angular/issues)
- 📧 Entre em contato: mauricio@exemplo.com

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!** ⭐

![GitHub stars](https://img.shields.io/github/stars/2mauricio21/MauricioGym-Angular?style=social)
![GitHub forks](https://img.shields.io/github/forks/2mauricio21/MauricioGym-Angular?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/2mauricio21/MauricioGym-Angular?style=social)