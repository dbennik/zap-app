import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Chart } from 'angular-highcharts';
import { FormControl } from '@angular/forms';
import { PlotLineOrBand } from 'highcharts';

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


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  temperatures: {Value: number, Availability: number, DateTime: string};
  humidity: {Value: number, Availability: number, DateTime: string};

  zapChance = new FormControl('');

  today: Date = new Date();
  currentHour: string = String(this.today.getHours()).padStart(2, '0');
  previousHour: string = String(this.today.getHours() - 1).padStart(2, '0');
  currentDay: string = String(this.today.getDate()).padStart(2, '0');
  currentMonth: string = String(this.today.getMonth() + 1).padStart(2, '0');
  currentYear: string = String(this.today.getFullYear() - 1);

  zapOMeter = new Chart({
    chart: {
      type: 'gauge',
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
          },

    title: {
      text: 'Chance of zapping your cat',
    },

    pane: {
      startAngle: -150,
      endAngle: 150,
      background: [{
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#FFF'],
            [1, '#333']
          ]
        },
        borderWidth: 0,
        outerRadius: '109%'
      }, {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#333'],
            [1, '#FFF']
          ]
        },
        borderWidth: 1,
        outerRadius: '107%'
      }, {
        // default background
      }, {
        backgroundColor: '#DDD',
        borderWidth: 0,
        outerRadius: '105%',
        innerRadius: '103%'
      }]
    },

    // the value axis
    yAxis: {
      min: 0,
      max: 100,

      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#666',

      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      labels: {
        step: 2
      },
      title: {
        text: 'Zap Chance'
      },
      plotBands: [{
        from: 0,
        to: 60,
        color: '#55BF3B' // green
      }, {
        from: 60,
        to: 80,
        color: '#DDDF0D' // yellow
      }, {
        from: 80,
        to: 100,
        color: '#DF5353' // red
      }]
    },
    series: [{
      type: 'gauge',
      name: 'Zap Chance',
      data: [0],
      tooltip: {
        valueSuffix: ' %'
      }
    }]
  });

  // My current position (determined by browser on the device)
  latMe: number;
  lonMe: number;
  nearestStationCode: string = '06344';
  nearestStationName: string = 'Rotterdam';

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  applyZapChance(zapValue: number): void {
    this.zapOMeter.removeSeries(0);
    this.zapOMeter.addSeries({
      type: 'gauge',
      name: 'Zap Chance',
      data: [zapValue],
      tooltip: {
        valueSuffix: ' %'
            }
    }, true, true);
  }
  resetZapChance(): void {
    this.getZapData();
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
    this.getZapData();
  }

  getZapData(): void {
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
      this.zapChance.setValue(100 - this.humidity[0].Value);
      this.applyZapChance(100 - this.humidity[0].Value);
    });
  }

}
