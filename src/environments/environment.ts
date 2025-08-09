export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api',
  apiUrls: {
    auth: 'http://localhost:5001/api/usuario',
    usuario: 'http://localhost:5001/api/Usuario',
    academia: 'http://localhost:5001/api/Academia',
    plano: 'http://localhost:5001/api/Plano',
    pagamento: 'http://localhost:5001/api/Pagamento',
    acesso: 'http://localhost:5001/api/Acesso',
    usuarioAcademia: 'http://localhost:5001/api/UsuarioAcademia',
    bloqueioAcesso: 'http://localhost:5001/api/BloqueioAcesso'
  },
  auth: {
    tokenKey: 'mauriciogym_token',
    refreshTokenKey: 'mauriciogym_refresh_token',
    loginEndpoint: '/login',
    refreshEndpoint: '/refresh'
  }
};
