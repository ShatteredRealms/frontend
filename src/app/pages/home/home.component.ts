import { Component } from '@angular/core';
import { KeycloakService } from '../../auth/keycloak.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    protected _keycloak: KeycloakService,
  ) { }

  register() {
    this._keycloak.register();
  }
}
