export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  apiUrls: {
    usuario: 'http://localhost:8000/api/Usuario',
    academia: 'http://localhost:8000/api/Academia',
    plano: 'http://localhost:8000/api/Plano',
    pagamento: 'http://localhost:8000/api/Pagamento',
    acesso: 'http://localhost:8000/api/Acesso',
    usuarioAcademia: 'http://localhost:8000/api/UsuarioAcademia',
    bloqueioAcesso: 'http://localhost:8000/api/BloqueioAcesso'
  },
  auth: {
    tokenKey: 'mauriciogym_token',
    refreshTokenKey: 'mauriciogym_refresh_token'
  }
};
