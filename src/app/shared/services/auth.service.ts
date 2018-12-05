import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';

import { Storage } from '@ionic/storage';
import { Platform, LoadingController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';

import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: DbService,
    private storage: Storage,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private googlePlus: GooglePlus,
    private fb: Facebook,
  ) { 
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => (user ? db.doc$(`users/${user.uid}`) : of(null)))
    );

    this.handleRedirect();
  }  

  singOut(){       
    this.afAuth.auth.signOut(); 

    if(this.platform.is('cordova')){
      this.googlePlus.logout();
      this.fb.logout();
    }
  }

  async facebookLogin() {
    try{
      const fbResponse = await this.fb.login(['public_profile', 'email']);

      const fb_id = fbResponse.authResponse.userID;
      const fb_token = fbResponse.authResponse.accessToken;

      const profile = await this.fb.api('/me?fields=id,name,email,first_name,last_name,picture.width(720).height(720).as(picture_large)', []);

      await this.afAuth.auth.signInWithCredential(
        auth.FacebookAuthProvider.credential(fb_token)
      );

      this.setRedirect(true);

      const user = {
          uid: fb_id,
          email: profile["email"],
          displayName: profile["first_name"] + " " +  profile["last_name"],
          photoURL: profile["picture_large"]['data']['url']
      }

      return this.updateUserData(user);
    } catch (error){
    console.log(error);
    }
  }

  async googleLogin(){
    try{
      let user;      
      
      if(this.platform.is('cordova')){
        user = await this.nativeGoogleLogin();
      }
      else{
        await this.setRedirect(true);
        const provider = new auth.GoogleAuthProvider();
        user = await this.afAuth.auth.signInWithRedirect(provider);
      }

      return await this.updateUserData(user);
    } catch (error){
      console.log(error);
    }
  }
  
  async isRedirect(){
    return await this.storage.get('authRedirect');
  }

  uid(){
    return this.user$
      .pipe(
        take(1),
        map(u => u && u.uid)
      )
      .toPromise();
  }

  setRedirect(value){
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

  private async handleRedirect(){
    if((await this.isRedirect()) !== true){
      return null;
    }

    const loading = await this.loadingCtrl.create();
    await loading.present();

    const result = await this.afAuth.auth.getRedirectResult();

    if(result.user){
      await this.updateUserData(result.user);
    }

    await loading.dismiss();

    await this.setRedirect(false);

    return result;
  }

  private updateUserData(user){
    const path = `users/${user.uid}`;

    return this.db.updateAt(path, user)
  }
}
