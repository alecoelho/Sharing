import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule} from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';

import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule} from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFirestore } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMenuComponent } from './components/app-menu.component';

import { AuthService } from '../shared/services/auth.service';
import { DbService } from '../shared/services/db.service';

import { environment } from '../../environments/environment';

@NgModule({
   declarations: [
      AppComponent,
      AppMenuComponent
   ],
   entryComponents: [],
   imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireStorageModule,
      AngularFireAuthModule,
      AngularFireFunctionsModule,
      AngularFireMessagingModule,
      IonicStorageModule.forRoot()
   ],
   providers: [
      DbService,
      AuthService,
      Firebase,
      StatusBar,
      SplashScreen,
      GooglePlus,
      Facebook,
      AngularFirestore,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
   ],
   bootstrap: [AppComponent]
})
export class AppModule {}
