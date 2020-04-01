import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  temperatures: {Value: number, Availability: number, DateTime: string}
  humidity: {Value: number, Availability: number, DateTime: string}

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    this.mainService.getTimeSeriesData({
      'Readers': [
        {
          'DataSourceCode': 'Knmi.Synops',
          'Settings': {
            'StartDate': '20190101000000',
            'EndDate': '20190102000000',
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
      console.log(data);
    });
  }

}
