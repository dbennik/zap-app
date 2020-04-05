import { Injectable } from '@angular/core';
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

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

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

  constructor(private mainService: MainService) {
  }

  addWeatherStationMarkers(map: L.map, lonMe: number, latMe: number): void {
      // determine nearest weather station
      let shortestDistance: number = 0;
      let nearestStationCode: string = '';
      for (const wstation of wstations) {
        const latStation = wstation.coordinate[1];
        const lonStation = wstation.coordinate[0];
        let distanceBetweenMeAndStation: number = distance(latMe, lonMe, latStation, lonStation, 'K');
        if (shortestDistance == 0 || distanceBetweenMeAndStation < shortestDistance) {
          shortestDistance = distanceBetweenMeAndStation;
          nearestStationCode = wstation.code;
        }
      }

      for (const wstation of wstations) {
        //console.log('wstation: ', wstation);
        const lat = wstation.coordinate[1];
        const lon = wstation.coordinate[0];
        let fcolor: string = 'blue';
        let r: number = 2000;
        if (wstation.code == nearestStationCode) {
          fcolor = 'yellow';
          r = 4000;
        }
        //const marker = L.marker([lon, lat]).addTo(map);
        var marker = L.circle([lat, lon], {
            color: 'blue',
            fillColor: fcolor,
            fillOpacity: 0.8,
            radius: r
        }).addTo(map);
        let isNearestStation: boolean = wstation.code == nearestStationCode;
        this.getZapData(marker, wstation.code, wstation.name, isNearestStation);
      }

  }

  addMyCurrentPositionMarker(map: L.map, lon: number, lat: number): void {
    this.addWeatherStationMarkers(map, lon, lat);

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

  getZapData(marker: L.circle, stationCode: string, stationName: string, isNearestStation: boolean): void {
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
      let nearestStationText: string = '';
      if (isNearestStation) {
        nearestStationText = '(nearest weather station)<br/><br/>'
      }
      marker.bindPopup('<h3>' + stationName + '</h3>' + nearestStationText +
        'temperature: ' + this.temperatures[0].Value + '℃<br/>' +
        'humidity: ' + this.humidity[0].Value + '%<br/><br/>' +
        '<b>zap chance: ' + (100 - this.humidity[0].Value) + '%</b>'
      );
    });
  }
}
