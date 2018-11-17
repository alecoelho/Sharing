import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private authService: AuthService, private router: Router) { }

  async signinWithGoogle(){
    this.authService.googleLogin();
    this.router.navigate(['/home']);
  }

}
