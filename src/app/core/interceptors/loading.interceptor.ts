import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // URLs que não devem mostrar loading
  const skipLoadingUrls = [
    '/health',
    '/ping',
    '/heartbeat'
  ];

  const shouldSkipLoading = skipLoadingUrls.some(url => req.url.includes(url));

  if (!shouldSkipLoading) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldSkipLoading) {
        loadingService.hide();
      }
    })
  );
};
