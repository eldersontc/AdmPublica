import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GoogleMaps, GoogleMapsEvent, Marker, GoogleMap, GoogleMapOptions } from '@ionic-native/google-maps';
import { IncidenciaProvider, IIncidencia } from '../../providers/incidencia/incidencia';
import { FotoPage } from '../foto/foto';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@Component({
  selector: 'page-incidencia',
  templateUrl: 'incidencia.html',
})
export class IncidenciaPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public googlemaps: GoogleMaps,
    public diagnostic: Diagnostic,
    public locationAccuracy: LocationAccuracy,
    public incidenciaPrv: IncidenciaProvider,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad(){
    this.validarGps();
  }

  enableGps: boolean = false;

  showError() {
    const alert = this.alertCtrl.create({
      title: 'Problema de conexión',
      subTitle: 'Ocurrió un error en la conexión.',
      buttons: ['OK']
    });
    alert.present();
  }

  validarGps(){
    this.diagnostic.isLocationEnabled().then(resultado =>{
      this.enableGps = resultado;
      this.crearMapa();
      if(!resultado){
        this.solicitarGps();
      }
    }).catch(error => {
      this.showError();
    });
  }

  solicitarGps(){
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            this.enableGps = true;
            this.map.setMyLocationButtonEnabled(true);
            this.moveCamera();
            this.get();
          },
          error => {
            console.log(error);
          }
        );
      }
    
    });
  }

  get(){
    this.incidenciaPrv.get().subscribe(data => {
      this.addMarkets(data);
    }, error => {
      this.showError();
    });
  }

  private locations: Array<any> = [];

  addMarkets(data: IIncidencia[]){

    for(let d of data){
      this.locations.push({name: d.id, position: {lat: +d.latitud, lng: +d.longitud}});
    }

    this.map.addMarkerCluster({
      markers: this.locations,
      icons: [
        {
          min: 2,
          max: 9,
          url: "./assets/markercluster/small.png",
          label: {
            color: "white"
          }
        },
        {
          min: 10,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]
    }).then((markerCluster) => {
      markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
        let marker: Marker = params[1];
        let id: number = marker.get("name");
        if (id > 0){
          this.navCtrl.push(FotoPage, { id: id });
        } else{
          marker.setTitle('Foto no disponible');
          marker.showInfoWindow();
        }
      });
    });

  }

  map: GoogleMap;

  crearMapa(){
    let opcionesMapa: GoogleMapOptions = {
      mapType: 'MAP_TYPE_TERRAIN',
      controls: {
        compass: true,
        myLocation: true,
        myLocationButton: this.enableGps,
        zoom: true
      }
    };

    this.map = this.googlemaps.create('map_canvas', opcionesMapa);
    this.map.one(GoogleMapsEvent.MAP_READY).then(resultado => {
        if(this.enableGps){
          this.moveCamera();
          this.get();
        }
      }).catch(error => {
        this.showError();
      }
    );

  }

  moveCamera(){
    this.map.getMyLocation().then(respuesta => {
      this.map.moveCamera({
        target: respuesta.latLng,
        zoom: 18,
      });
    }).catch(error => {
      this.showError();
    });
  }

}
