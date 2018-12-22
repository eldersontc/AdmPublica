import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpClientModule } from '@angular/common/http';

import { GoogleMaps } from '@ionic-native/google-maps';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { IncidenciaPage } from '../pages/incidencia/incidencia';
import { IncidenciaProvider } from '../providers/incidencia/incidencia';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { ListUsuarioPage } from '../pages/list-usuario/list-usuario';
import { UsuarioPage } from '../pages/usuario/usuario';
import { FotoPage } from '../pages/foto/foto';

@NgModule({
  declarations: [
    MyApp,
    IncidenciaPage,
    ListUsuarioPage,
    UsuarioPage,
    FotoPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IncidenciaPage,
    ListUsuarioPage,
    UsuarioPage,
    FotoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Diagnostic,
    LocationAccuracy,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    IncidenciaProvider,
    UsuarioProvider
  ]
})
export class AppModule {}
