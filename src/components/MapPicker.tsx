import { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import { MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export function MapPicker({ onLocationChange, initialLat = 24.7136, initialLng = 46.6753 }: MapPickerProps) {
  const [viewport, setViewport] = useState({
    latitude: initialLat,
    longitude: initialLng,
    zoom: 12,
  });
  
  const [marker, setMarker] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });

  const handleMapClick = (event: any) => {
    const { lng, lat } = event.lngLat;
    setMarker({ latitude: lat, longitude: lng });
    onLocationChange(lat, lng);
  };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border-2">
      <Map
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN || ""}
      >
        <Marker latitude={marker.latitude} longitude={marker.longitude}>
          <MapPin className="w-8 h-8 text-primary fill-primary" />
        </Marker>
      </Map>
    </div>
  );
}
