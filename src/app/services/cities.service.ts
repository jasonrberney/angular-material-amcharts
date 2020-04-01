import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CitiesService {
    allData$: BehaviorSubject<any[]>;

    constructor(private http: HttpClient) {}

    get(): Observable<City[]> {
        return this.http.get<City[]>('http://localhost:3000/api/locations')
            .pipe(
                map((x: City[]) => {
                    console.log(x)
                    return x;
                }),
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        console.error(error.message);
        return throwError('A data error occurred, please try again.');
    }
}

export interface City {
    name: string;
    coordinates: [string, string];
    latitude: string;
    longitude: string;
}