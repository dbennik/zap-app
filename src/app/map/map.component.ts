import { Component, OnInit } from '@angular/core';
import { MarkerService } from '../marker.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map;

  constructor(private markerService: MarkerService) { }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // init map on center of the Netherlands and zoom in on the Netherlands
    this.map = L.map('map', {
      center: [ 52.228936, 5.321492 ],
      zoom: 7
    });

    this.addBaseMap();
    this.getCurrentLocation();
    this.markerService.addWeatherStationMarkers(this.map);
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: Position) => {
            if (position) {
                this.markerService.addMyCurrentPositionMarker(this.map, position.coords.longitude, position.coords.latitude);
            }
        })
    }
  }

  private addBaseMap(): void {
    // add a base layer containing a map
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

}
