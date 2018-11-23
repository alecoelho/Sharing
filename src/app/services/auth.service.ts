import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';

import { Storage } from '@ionic/storage';
import { Platform, LoadingController, ToastController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { DbService } from './db.service';

import { AppUser } from '../models/app-user';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: DbService,
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    public toastController: ToastController
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => (user ? db.doc$(`users/${user.uid}`) : of(null)))
    );

    this.handleRedirect();
  }

  async singOut() {
    if (this.platform.is('cordova')) {
      await this.googlePlus.logout();
    }

    return await this.afAuth.auth.signOut();
  }

  async facebookLogin() {
    this.fb.login(['public_profile', 'email'])
    .then((res: FacebookLoginResponse) => async() => {
      const user = await this.afAuth.auth.signInWithCredential(
        auth.FacebookAuthProvider.credential(res.authResponse.accessToken)
      );
      await this.setRedirect(true);
      return await this.updateUserData(user);
    })
    .catch((e) => console.log('Error' + e));
  }

  async googleLogin() {
    try {
      let user;

      if (this.platform.is('cordova')) {
        user = await this.nativeGoogleLogin();
      } else {
        await this.setRedirect(true);
        const provider = new auth.GoogleAuthProvider();
        user = await this.afAuth.auth.signInWithRedirect(provider);
      }

      return await this.updateUserData(user);
    } catch (error) {
      console.log(error);
    }
  }

  async isRedirect() {
    return await this.storage.get('authRedirect');
  }

  uid() {
    return this.user$
      .pipe(
        take(1),
        map(u => u && u.uid)
      )
      .toPromise();
  }

  setRedirect(value) {
    this.storage.set('authRedirect', value);
  }

  private async nativeGoogleLogin(): Promise<any> {
    const gplusUser = await this.googlePlus.login({
      webClientId: '727936331391-n6905q9s5sg5n12dp3ui3cknuqgngevh.apps.googleusercontent.com',
      offline: true,
      scopes: 'profile email'
    });

    return await this.afAuth.auth.signInWithCredential(
      auth.GoogleAuthProvider.credential(gplusUser.idToken)
    );
  }

  private async handleRedirect() {
    if ((await this.isRedirect()) !== true) {
      return null;
    }

    const loading = await this.loadingCtrl.create();
    await loading.present();

    const result = await this.afAuth.auth.getRedirectResult();

    if (result.user) {
      await this.updateUserData(result.user);
    }

    await loading.dismiss();

    await this.setRedirect(false);

    return result;
  }

  private updateUserData(user) {
    const path = `users/${user.uid}`;

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,

    };

    return this.db.updateAt(path, data);
  }
}
