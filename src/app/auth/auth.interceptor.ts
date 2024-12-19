import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from './keycloak.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);
  if (keycloak.instance.authenticated) {
    req.headers.set('Authorization', `Bearer ${keycloak.instance.token}`);
  }
  return next(req);
};
