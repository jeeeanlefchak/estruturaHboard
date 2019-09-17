import { DataConnService } from './services/shared/data-conn.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './guards/auth.guard';
import { SecurityService } from './services/security.service';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenService } from './services/token.service';
import { ModalInstitutionPage } from './modals/modal-institution/modal-institution.page';
import { ModalInstitutionPageModule } from './modals/modal-institution/modal-institution.module';
import { MenuComponentModule } from './components/menu/menu.component';
import { AssessmentModule } from './pages/assessment/assessment.module';
import { Storage } from '@ionic/storage';
import { PersonService } from './services/person.service';
import { CommunicationChannelModal } from './modals/communication-channel/channel.modal.';
import { CommunicationChannelModule } from './modals/communication-channel/channel.module';

export function tokenGetter() {
  return localStorage.getItem('accessToken');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [
    ModalInstitutionPage,
    CommunicationChannelModal
  ],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql'],
    }),

    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    AppRoutingModule,
    ModalInstitutionPageModule,
    CommunicationChannelModule,
    MenuComponentModule,
    AssessmentModule,

  ],
  providers: [
    StatusBar,
    SplashScreen,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthenticationService,
    AuthGuard,
    SecurityService,
    TokenService,
    DataConnService,
    { provide: 'configurations', useFactory: provideHboard },
    { provide: 'boards', useFactory: provideBoard },
    PersonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function provideHboard() {
  return new Storage({
    name: '__mydb',
    storeName: 'configurations',
  });
}

export function provideBoard() {
  return new Storage({
    name: '__mydb',
    storeName: 'boards',
  });
}
