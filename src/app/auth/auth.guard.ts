import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { KeycloakService } from './keycloak.service';

export const authGuard: CanActivateFn = (route, state) => {
  const keycloak = inject(KeycloakService);

  if (!keycloak.instance.authenticated) {
    keycloak.login({
      redirectUri: window.location.origin + state.url,
    })
    return false;
  }

  const requiredRoles: string[] = route.data['roles'] || [];
  if (requiredRoles.length > 0 && !requiredRoles.some(
    (role: string) => {
      let splitRole = role.split(':');
      if (splitRole.length == 2) {
        return keycloak.instance.hasResourceRole(splitRole[1], splitRole[0]);
      }
      return keycloak.instance.hasRealmRole(role);
    }
  )) {
    return false;
  }

  const requiredGroups: string[] = route.data['groups'] || [];
  const userInfo = keycloak.instance.userInfo as { groups: string[] };
  let groups: string[] = userInfo?.groups || [];

  if (requiredGroups.length > 0 && !requiredGroups.some(
    (group: string) => groups.indexOf(group) >= 0
  )) {
    return false;
  }

  return true;
};
