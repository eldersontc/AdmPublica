import { Component } from '@angular/core';
import { 
  ModalController, 
  Platform, 
  NavParams, 
  NavController
} from 'ionic-angular';
import { IncidenciaService } from './home.service';
import { IIncidencia } from './incidencia';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  LatLng,
  Marker
} from '@ionic-native/google-maps'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private incidenciaService: IncidenciaService,
    private googlemaps: GoogleMaps,
    public modalCtrl: ModalController) {

  }

  ionViewDidLoad(){
    this.crearMapa();
  }

  data: string;

  getIncidencias(){
    this.incidenciaService.get().subscribe(data => {
      this.addMarkets(data);
    }, error => {
      alert(error);
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
          this.getFoto(id);
        } else{
          marker.setTitle('Foto no disponible');
          marker.showInfoWindow();
        }
      });
    });

  }

  getFoto(id: number){
    this.incidenciaService.getFoto(id).subscribe(data => {
      this.verFoto(data);
    }, error => {
      alert(error);
    });
  }

  verFoto(base64: string) {
    let modal = this.modalCtrl.create('ModalPage', { base64: base64 });
    modal.present();
  }

  enableGps: boolean = true;

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
          this.getIncidencias();
        }
      }
    ).catch(error =>{
        console.log(error);
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
      console.log(error);
    });
  }

}