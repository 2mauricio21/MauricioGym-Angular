export const environment = {
  production: true,
  apiUrl: 'https://api.mauriciogym.com/api',
  apiUrls: {
    usuario: 'https://api.mauriciogym.com/api/Usuario',
    academia: 'https://api.mauriciogym.com/api/Academia',
    plano: 'https://api.mauriciogym.com/api/Plano',
    pagamento: 'https://api.mauriciogym.com/api/Pagamento',
    acesso: 'https://api.mauriciogym.com/api/Acesso',
    usuarioAcademia: 'https://api.mauriciogym.com/api/UsuarioAcademia'
  },
  auth: {
    tokenKey: 'mauriciogym_token',
    refreshTokenKey: 'mauriciogym_refresh_token'
  }
};
