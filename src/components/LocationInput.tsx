import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPicker } from "./MapPicker";

interface LocationInputProps {
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationInput({ onLocationChange }: LocationInputProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [open, setOpen] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    onLocationChange(lat, lng);
    setOpen(false);
  };

  return (
    <div>
      <Label className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4" />
        موقع الاستلام (اختياري)
      </Label>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full">
            {location 
              ? `تم تحديد الموقع: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
              : "اختر موقع الاستلام على الخريطة"
            }
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>حدد موقع الاستلام</DialogTitle>
          </DialogHeader>
          <MapPicker 
            onLocationChange={handleLocationSelect}
            initialLat={location?.lat}
            initialLng={location?.lng}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
