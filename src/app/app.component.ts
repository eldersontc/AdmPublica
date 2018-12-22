import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController, Loading } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IncidenciaPage } from '../pages/incidencia/incidencia';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { ListUsuarioPage } from '../pages/list-usuario/list-usuario';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any, icon: any}>;

  logueado: boolean = false;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public usuarioPrv: UsuarioProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  loading: Loading;

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Autenticando...'
    });
    this.loading.present();
  }

  showError() {
    const alert = this.alertCtrl.create({
      title: 'Autenticación',
      subTitle: 'Usuario o Password incorrecto.',
      buttons: ['OK']
    });
    alert.present();
  }

  usuario: string;
  password: string;

  login(){
    this.presentLoading();
    this.usuarioPrv.auth({
      alias: this.usuario,
      password: this.password
    }).subscribe(data => {
      if (data.perfil == 'ADMINISTRADOR'){
        this.pages = [
          { title: 'Basura en la vía pública', component: IncidenciaPage, icon: 'pin' },
          { title: 'Adm. usuarios', component: ListUsuarioPage, icon: 'people' }
        ];
      } else {
        this.pages = [
          { title: 'Basura en la vía pública', component: IncidenciaPage, icon: 'pin' }
        ];
      }
      this.logueado = true;
      this.openPage(this.pages[0]);
      this.usuario = '';
      this.password = '';
      this.loading.dismiss();
    }, error => {
      this.showError();
      this.loading.dismiss();
    });
    
  }

  logout(){
    this.logueado = false;
  }
}
