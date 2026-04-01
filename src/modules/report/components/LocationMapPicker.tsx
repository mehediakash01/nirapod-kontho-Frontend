'use client';

import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type LocationMapPickerProps = {
  location: string;
  latitude?: number;
  longitude?: number;
  onChange: (value: { location: string; latitude: number; longitude: number }) => void;
};

type OSMPlace = {
  display_name: string;
  lat: string;
  lon: string;
};

const SYLHET_CENTER = { lat: 24.8949, lng: 91.8687 };

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      onMapClick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function RecenterMap({ latitude, longitude }: { latitude?: number; longitude?: number }) {
  const map = useMap();

  useEffect(() => {
    if (
      typeof latitude === 'number' &&
      Number.isFinite(latitude) &&
      typeof longitude === 'number' &&
      Number.isFinite(longitude)
    ) {
      map.setView([latitude, longitude], Math.max(map.getZoom(), 15));
    }
  }, [latitude, longitude, map]);

  return null;
}

export default function LocationMapPicker({
  location,
  latitude,
  longitude,
  onChange,
}: LocationMapPickerProps) {
  const [searchTerm, setSearchTerm] = useState(location);
  const [suggestions, setSuggestions] = useState<OSMPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setSearchTerm(location);
  }, [location]);

  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (trimmed.length < 3) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=bd&q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const data = (await response.json()) as OSMPlace[];
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const markerPosition = useMemo(
    () => ({
      lat:
        typeof latitude === 'number' && Number.isFinite(latitude)
          ? latitude
          : SYLHET_CENTER.lat,
      lng:
        typeof longitude === 'number' && Number.isFinite(longitude)
          ? longitude
          : SYLHET_CENTER.lng,
    }),
    [latitude, longitude]
  );

  const updateFromCoordinates = async (lat: number, lng: number) => {
    let resolvedLocation = location;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      if (response.ok) {
        const data = (await response.json()) as { display_name?: string };
        if (data.display_name) {
          resolvedLocation = data.display_name;
        }
      }
    } catch {
      // Keep typed location when reverse lookup fails.
    }

    onChange({ location: resolvedLocation, latitude: lat, longitude: lng });
    setSuggestions([]);
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Search Place (OpenStreetMap)</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search area, road, landmark, or district"
                className="h-11 pl-8"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => {
                if (
                  typeof latitude === 'number' &&
                  Number.isFinite(latitude) &&
                  typeof longitude === 'number' &&
                  Number.isFinite(longitude)
                ) {
                  updateFromCoordinates(latitude, longitude);
                }
              }}
            >
              <MapPin className="size-4" />
              Use Pinned Point
            </Button>
          </div>

          {isSearching ? <p className="text-xs text-gray-500">Searching places...</p> : null}

          {suggestions.length ? (
            <div className="max-h-44 overflow-y-auto rounded-lg border bg-white">
              {suggestions.map((place) => (
                <button
                  key={`${place.lat}-${place.lon}-${place.display_name}`}
                  type="button"
                  onClick={() => {
                    const lat = Number(place.lat);
                    const lng = Number(place.lon);
                    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                      return;
                    }
                    onChange({ location: place.display_name, latitude: lat, longitude: lng });
                    setSuggestions([]);
                  }}
                  className="w-full border-b px-3 py-2 text-left text-xs text-gray-700 transition last:border-b-0 hover:bg-muted"
                >
                  {place.display_name}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-lg border">
          <MapContainer
            center={[markerPosition.lat, markerPosition.lng]}
            zoom={12}
            scrollWheelZoom
            className="h-72 w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[markerPosition.lat, markerPosition.lng]} icon={markerIcon} />
            <MapClickHandler onMapClick={updateFromCoordinates} />
            <RecenterMap latitude={latitude} longitude={longitude} />
          </MapContainer>
        </div>
        <p className="text-xs text-gray-500">Click anywhere on the map to set location and coordinates.</p>
      </CardContent>
    </Card>
  );
}
