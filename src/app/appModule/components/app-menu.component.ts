import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'app-menu.component.html',
  styleUrls:['app-menu.component.scss']
})
export class AppMenuComponent {
    constructor(private authService: AuthService) {}

    signOut(){
        this.authService.singOut();
    }
}