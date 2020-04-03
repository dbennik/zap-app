import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Chart } from 'angular-highcharts';
import { FormControl } from '@angular/forms';

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
      plotShadow: false
    },

    title: {
      text: 'Zap-O-Meter'
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

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    this.getCurrentLocation();
    this.getZapData();
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
                //this.curPosLat = position.coords.latitude;
                //this.curPosLng = position.coords.longitude;
            }
        })
    }
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
              '06344'
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
