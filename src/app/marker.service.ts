import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  stations: string = '/assets/weatherstations.geojson';

  constructor(private http: HttpClient) {
  }

  addWeatherStationMarkers(map: L.map): void {
    this.http.get(this.stations).subscribe((res: any) => {
      for (const station of res.features) {
        const lat = station.geometry.coordinates[0];
        const lon = station.geometry.coordinates[1];
        const marker = L.marker([lon, lat]).addTo(map);
      }
    });
  }

  addMyCurrentPositionMarker(map: L.map, lon: number, lat: number): void {
    const marker = L.marker([lon, lat]).addTo(map); 
  }
}
