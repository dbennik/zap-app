import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl } from '@angular/forms';

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

export interface WeatherStation {
  name: string;
  code: string;
  lat: number;
  lon: number
}


@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {

  weatherstations: WeatherStation[] = [
      { "name": "Rotterdam",          "code": "06344", "lon": 4.45, "lat": 51.95 },
      { "name": "Woensdrecht",        "code": "06340", "lon": 4.333, "lat": 51.45 },
      { "name": "Amsterdam/Schiphol", "code": "06240", "lon": 4.767, "lat": 52.3 },
      { "name": "De Kooy",            "code": "06235", "lon": 4.783, "lat": 52.917 },
      { "name": "Hoorn/Terschelling", "code": "06251", "lon": 5.35, "lat": 53.383 },
      { "name": "Lelystad",           "code": "06269", "lon": 5.533, "lat": 52.45 },
      { "name": "De Bilt",            "code": "06260", "lon": 5.183, "lat": 52.1 },
      { "name": "Leeuwarden",         "code": "06270", "lon": 5.767, "lat": 53.217 },
      { "name": "Deelen",             "code": "06275", "lon": 5.883, "lat": 52.067 },
      { "name": "Hoogeveen",          "code": "06279", "lon": 6.517, "lat": 52.733 },
      { "name": "Groningen",          "code": "06280", "lon": 6.583, "lat": 53.133 },
      { "name": "Hupsel",             "code": "06283", "lon": 6.65, "lat": 52.067 },
      { "name": "Heino",              "code": "06278", "lon": 6.267, "lat": 52.433 },
      { "name": "Vlissingen",         "code": "06310", "lon": 3.6, "lat": 51.45 },
      { "name": "Gilze Rijen",        "code": "06350", "lon": 4.933, "lat": 51.567 },
      { "name": "Eindhoven",          "code": "06370", "lon": 5.417, "lat": 51.45 },
      { "name": "Volkel",             "code": "06375", "lon": 5.7, "lat": 51.65 },
      { "name": "Maastricht",         "code": "06380", "lon": 5.783, "lat": 50.917 },
      { "name": "Arcen",              "code": "06391", "lon": 6.2, "lat": 51.5 }
  ]

  targetDate = new FormControl(new  Date());
  selectedStationCode: string = '06344';

  temperatures: {Value: number, Availability: number, DateTime: string};
  humidity: {Value: number, Availability: number, DateTime: string};

  temp: number;
  humid: number;
  zapChance: number;

  currentHour: string = String(this.targetDate.value.getHours()).padStart(2, '0');
  previousHour: string = String(this.targetDate.value.getHours() - 1).padStart(2, '0');
  currentDay: string = String(this.targetDate.value.getDate()).padStart(2, '0');
  currentMonth: string = String(this.targetDate.value.getMonth() + 1).padStart(2, '0');
  currentYear: string = String(this.targetDate.value.getFullYear() - 1);

  // My current position (determined by browser on the device)
  latMe: number;
  lonMe: number;
  nearestStationCode: string = '06344';
  nearestStationName: string = 'Rotterdam';

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  setDate():void {
    this.currentDay = String(this.targetDate.value.getDate()).padStart(2, '0');
    this.currentMonth = String(this.targetDate.value.getMonth()).padStart(2, '0');
    this.currentYear = String(this.targetDate.value.getFullYear() - 1).padStart(2, '0');
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: Position) => {
            if (position) {
              this.latMe = position.coords.latitude;
              this.lonMe = position.coords.longitude;
              this.determineNearestWeatherStation();
              return;
            }
        })
    }
    this.getZapData();
  }

  determineNearestWeatherStation(): void {
    let shortestDistance: number = 0;
    for (const wstation of wstations) {
      const latStation = wstation.coordinate[1];
      const lonStation = wstation.coordinate[0];
      let distanceBetweenMeAndStation: number = distance(this.latMe, this.lonMe, latStation, lonStation, 'K');
      if (shortestDistance == 0 || distanceBetweenMeAndStation < shortestDistance) {
        shortestDistance = distanceBetweenMeAndStation;
        this.nearestStationCode = wstation.code;
        this.nearestStationName = wstation.name;
      }
    }
    //this.getZapData();
  }

  getZapData(): void {
    this.setDate();
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
              this.nearestStationCode
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
      this.temp = this.temperatures[0].Value;
      this.humid = this.humidity[0].Value;
      this.zapChance = 100 - this.humid;
    });
  }

}
