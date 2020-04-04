import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainService } from './main.service';
import * as L from 'leaflet';

var wstations = [
  { "name": "Rotterdam",          "code": "06344", "coordinate": [4.45, 51.95] },
  { "name": "Woensdrecht",        "code": "06340", "coordinate": [4.333, 51.45] },
  { "name": "Amsterdam/Schiphol", "code": "06240", "coordinate": [4.767, 52.3] },
  { "name": "De Kooy",            "code": "06235", "coordinate": [4.783, 52.917] },
  { "name": "Hoorn/Terschelling", "code": "06251", "coordinate": [5.35, 53.383] },
  { "name": "Lelystad",           "code": "06269", "coordinate": [5.533, 52.45] },
  { "name": "De Bilt",            "code": "06260", "coordinate": [5.183, 52.1] },
  { "name": "Leeuwarden",         "code": "06270", "coordinate": [5.767, 53.217] },
  { "name": "Deelen",             "code": "06275", "coordinate": [5.883, 52.067] },
  { "name": "Hoogeveen",          "code": "06279", "coordinate": [6.517, 52.733] },
  { "name": "Groningen",          "code": "06280", "coordinate": [6.583, 53.133] },
  { "name": "Hupsel",             "code": "06283", "coordinate": [6.65, 52.067] },
  { "name": "Heino",              "code": "06278", "coordinate": [6.267, 52.433] },
  { "name": "Vlissingen",         "code": "06310", "coordinate": [3.6, 51.45] },
  { "name": "Gilze Rijen",        "code": "06350", "coordinate": [4.933, 51.567] },
  { "name": "Eindhoven",          "code": "06370", "coordinate": [5.417, 51.45] },
  { "name": "Volkel",             "code": "06375", "coordinate": [5.7, 51.65] },
  { "name": "Maastricht",         "code": "06380", "coordinate": [5.783, 50.917] },
  { "name": "Arcen",              "code": "06391", "coordinate": [6.2, 51.5] }
];

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  //stations: string = '/assets/weatherstations.geojson';

  temperatures: {Value: number, Availability: number, DateTime: string};
  humidity: {Value: number, Availability: number, DateTime: string};

  today: Date = new Date();
  currentHour: string = String(this.today.getHours()).padStart(2, '0');
  previousHour: string = String(this.today.getHours() - 1).padStart(2, '0');
  currentDay: string = String(this.today.getDate()).padStart(2, '0');
  currentMonth: string = String(this.today.getMonth() + 1).padStart(2, '0');
  currentYear: string = String(this.today.getFullYear() - 1);

  constructor(private http: HttpClient, private mainService: MainService) {
  }

  addWeatherStationMarkers(map: L.map): void {

      for (const wstation of wstations) {
        console.log('wstation: ', wstation);
        const lat = wstation.coordinate[1];
        const lon = wstation.coordinate[0];
        //const marker = L.marker([lon, lat]).addTo(map);
        var marker = L.circle([lat, lon], {
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.8,
            radius: 2000
        }).addTo(map);
        //marker.properties.code = wstation.code;
        //marker.properties.tmp = 18;
        //marker.bindPopup('<b>' + wstation.name + '</b><br/>' + 'temp: ' + marker.properties.tmp);
        this.getZapData(marker, wstation.code, wstation.name);
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

  getZapData(marker: L.circle, stationCode: string, stationName: string): void {
    this.mainService.getTimeSeriesData({
      'Readers': [
        {
          'DataSourceCode': 'Knmi.Synops',
          'Settings': {
            'StartDate': this.currentYear + this.currentMonth + this.currentDay + this.previousHour + '0000',
            'EndDate': this.currentYear + this.currentMonth + this.currentDay + this.currentHour + '0000',
            'VariableCodes': [
              'TMP', 'RH'
            ],
            'LocationCodes': [
              stationCode
            ]
          }
        }
      ],
      'Exporter': {
        'DataFormatCode': 'json',
        'Settings': {
        }
      }
    }).subscribe((data: any) => {
      this.temperatures = data.Data[0].Data;
      this.humidity = data.Data[1].Data;
      marker.bindPopup('<b>' + stationName + '</b><br/>' +
        'temperature: ' + this.temperatures[0].Value + '℃<br/>' +
        'humidity: ' + this.humidity[0].Value + '%'
      );
    });
  }
}
