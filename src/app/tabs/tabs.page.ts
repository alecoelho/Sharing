import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private authService: AuthService) {}

  signInWithGoogle(){
    this.authService.singOut();
    this.authService.googleLogin();
  }

  signInWithFacebook() {
    this.authService.facebookLogin();
  }
}
