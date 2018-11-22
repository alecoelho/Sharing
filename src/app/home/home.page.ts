import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private authService: AuthService) {}

  signInWithGoogle() {
    this.authService.googleLogin();
  }

  signInWithFacebook() {
    this.authService.facebookLogin();
  }
}
