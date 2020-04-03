import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import { MarkerService } from '../marker.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

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

  private addMyCurrentLocationMarker(): void {
    // add a marker with label Me
      //var myMarker = L.marker([this._global.curPosLat, this._global.curPosLng]).addTo(this.map);
      //myMarker.bindPopup("<b>Me</b>").openPopup();
  }

}
