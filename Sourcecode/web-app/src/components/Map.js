import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map center and zoom changes
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

export const MapConfig = {
  defaultCenter: [37.7749, -122.4194],  // San Francisco
  defaultZoom: 13,
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
  minZoom: 3,
  mapOptions: {
    zoomControl: true,
    scrollWheelZoom: true,
    dragging: true,
    doubleClickZoom: true,
  }
};

const Map = ({
  center = MapConfig.defaultCenter,
  zoom = MapConfig.defaultZoom,
  markers = [],
  onMarkerClick,
  onMapClick,
  showRoute = false,
  routeCoordinates = []
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '400px', width: '100%' }}
      onClick={onMapClick}
    >
      <TileLayer
        url={MapConfig.tileLayer}
        attribution={MapConfig.attribution}
      />
      <MapController center={center} zoom={zoom} />
      
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lng]}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(marker),
          }}
        >
          {marker.popup && (
            <Popup>
              {marker.popup}
            </Popup>
          )}
        </Marker>
      ))}

      {showRoute && routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          color="blue"
          weight={3}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
};

export default Map; 