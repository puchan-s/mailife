import React, { Component, createRef } from 'react';
import InputLabel from '@mui/material/InputLabel';
import { Button, TextField } from '@mui/material';
import { Point } from '../utils/classes/point';

interface CustomMapProps {
  onPoint: Point;

 }

interface CustomMapState {
  placeName: string;
  marker: google.maps.marker.AdvancedMarkerElement | null;
  point: Point;
}

class CustomMap extends Component<CustomMapProps, CustomMapState> {
  private mapContainerRef = createRef<HTMLDivElement>();
  private mapInstance: google.maps.Map | null = null;

  constructor(props: CustomMapProps) {
    super(props);
    this.state = {
      placeName: '',
      marker: null,
      point: props.onPoint
    };
  }

  componentDidMount() {
    if (this.mapContainerRef.current) {
      this.mapInstance = new google.maps.Map(this.mapContainerRef.current, {
        center: { lat: 37.406847477536914, lng: 140.35072086510343 },
        zoom: 10,
        mapId: "AIzaSyCgPnyehv6XCUQeq78zkwXf7k62UMRg_tc"

      });

      this.mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          if (this.state.marker !== null) {
            this.state.marker.setMap(null);
          }

          const latLng = event.latLng;
          const newMarker = new google.maps.marker.AdvancedMarkerElement({
            position: latLng,
            map: this.mapInstance,
          });

          this.state.point.setPoint(newMarker.position.Fg,newMarker.position.Gg);
          this.setState({ marker: newMarker });
        }
      });
    }
  }

  mapSearch = () => {
    if (!this.mapInstance) return;

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: this.state.placeName }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const latLng = results[0].geometry.location;
        this.mapInstance.setCenter(latLng);
        this.mapInstance.setZoom(15);

        if (this.state.marker !== null) {
          this.state.marker.setMap(null);
        }

        const newMarker = new google.maps.marker.AdvancedMarkerElement({
          position: latLng,
          map: this.mapInstance,
          title: this.state.placeName,
        });

        this.setState({ marker: newMarker });
      } else {
        console.error('Geocode was not successful for the following reason:', status);
        alert("エラー発生");
      }
    });
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ placeName: event.target.value });
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <InputLabel id="Name-title">場所名</InputLabel>
        <TextField
          id="name"
          label="場所名"
          type="search"
          variant="filled"
          value={this.state.placeName}
          onChange={this.handleInputChange}
        />
        <Button variant="contained" color="primary" onClick={this.mapSearch}>
          検索
        </Button>
        <div ref={this.mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }
}

export default CustomMap;
