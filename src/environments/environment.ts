export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  gatewayUrl: 'http://localhost:8000',
  apiUrls: {
    auth: 'http://localhost:8000/api/auth',
    seguranca: 'http://localhost:8000/api/seguranca',
    usuario: 'http://localhost:8000/api/usuario',
    academia: 'http://localhost:8000/api/academia',
    plano: 'http://localhost:8000/api/plano',
    pagamento: 'http://localhost:8000/api/pagamento',
    acesso: 'http://localhost:8000/api/acesso',
    usuarioAcademia: 'http://localhost:8000/api/usuarioacademia',
    bloqueioAcesso: 'http://localhost:8000/api/bloqueio'
  },
  auth: {
    tokenKey: 'mauriciogym_token',
    refreshTokenKey: 'mauriciogym_refresh_token',
    loginEndpoint: '/login',
    refreshEndpoint: '/refresh',
    validateEndpoint: '/validate-token'
  }
};
