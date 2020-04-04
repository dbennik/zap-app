import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

var wstations = [
  { "name": "Rotterdam", "coordinate": [4.45, 51.95] },
  { "name": "Woensdrecht", "coordinate": [4.333, 51.45] }
];

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  stations: string = '/assets/weatherstations.geojson';

  constructor(private http: HttpClient) {
  }

  addWeatherStationMarkers(map: L.map): void {

      for (const wstation of wstations) {
        console.log('wstation: ', wstation);
        const lat = wstation.coordinate[1];
        const lon = wstation.coordinate[0];
        //const marker = L.marker([lon, lat]).addTo(map);
        const circle = L.circle([lat, lon], {
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.8,
            radius: 2000
        }).addTo(map);
        circle.bindPopup(wstation.name);
      }

  }

  addMyCurrentPositionMarker(map: L.map, lon: number, lat: number): void {
    //const marker = L.marker([lon, lat]).addTo(map);
    const circle = L.circle([lat, lon], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.8,
        radius: 4000,
        label: 'Me'
    }).addTo(map);
    circle.bindPopup('Me').openPopup();
  }
}
