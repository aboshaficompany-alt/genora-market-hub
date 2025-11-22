import { useState } from "react";
import { MapPin } from "lucide-react";

interface MapPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export function MapPicker({ onLocationChange, initialLat = 24.7136, initialLng = 46.6753 }: MapPickerProps) {
  const [marker, setMarker] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert click position to approximate coordinates (simple demo calculation)
    const lng = initialLng + (x - rect.width / 2) / 100;
    const lat = initialLat - (y - rect.height / 2) / 100;
    
    setMarker({ latitude: lat, longitude: lng });
    onLocationChange(lat, lng);
  };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 relative bg-muted">
      {/* Demo Map Background */}
      <div 
        className="absolute inset-0 cursor-crosshair"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Demo Map Label */}
        <div className="absolute top-4 left-4 bg-background/90 px-3 py-2 rounded-lg shadow-md">
          <p className="text-sm font-medium">خريطة تجريبية</p>
          <p className="text-xs text-muted-foreground">انقر لتحديد الموقع</p>
        </div>

        {/* Center Reference */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground text-xs">
          الرياض
        </div>

        {/* Marker */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200"
          style={{
            left: `${50 + (marker.longitude - initialLng) * 100}%`,
            top: `${50 - (marker.latitude - initialLat) * 100}%`
          }}
        >
          <MapPin className="w-8 h-8 text-primary fill-primary drop-shadow-lg" />
        </div>

        {/* Coordinates Display */}
        <div className="absolute bottom-4 left-4 bg-background/90 px-3 py-2 rounded-lg shadow-md">
          <p className="text-xs text-muted-foreground">
            الإحداثيات: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}
