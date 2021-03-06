import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IncidenciaProvider {

  constructor(public http: HttpClient) {}

  private apiURL = 'http://190.234.66.232:88/api/incidencia';

  get(): Observable<IIncidencia[]> {
      return this.http.get<IIncidencia[]>(this.apiURL);
  }

  getFoto(id): Observable<string> {
      return this.http.get<string>(this.apiURL + '/foto/' + id);
  }

}

export interface IIncidencia {
  id?: number;
  fechaHora?: Date;
  latitud?: number;
  longitud?: number;
  base64?: string;
  foto?: boolean;
  fabricante?: string;
  modelo?: string;
  plataforma?: string;
  version?: string;
  serial?: string;
  UUID?: string;
}