import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private alertCtrl: AlertController){}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean>  {

    const uid = await this.auth.uid();
    return !!uid;
  }
}
