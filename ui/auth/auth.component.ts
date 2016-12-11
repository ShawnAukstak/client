import { Component } from '@angular/core';
import { Router }    from '@angular/router';

import { ApiService } from 'pydt-shared';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  private model = new AuthModel();

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    this.apiService.setToken(this.model.token)
      .then(() => {
        this.router.navigate(['/']);
      });
  }
}

class AuthModel {
  public token: string;
}