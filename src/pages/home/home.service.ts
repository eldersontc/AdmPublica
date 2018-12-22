import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IIncidencia } from './incidencia';

@Injectable()
export class IncidenciaService {

    private apiURL = 'https://190.234.66.232:88/api/incidencia';

    constructor(private http: HttpClient) { }

    get(): Observable<IIncidencia[]> {
        return this.http.get<IIncidencia[]>(this.apiURL);
    }

    getFoto(id: number): Observable<string> {
        return this.http.get<string>(this.apiURL + '/foto/' + id);
    }

}