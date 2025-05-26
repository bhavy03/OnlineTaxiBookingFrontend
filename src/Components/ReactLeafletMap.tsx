// SourceDestinationMap.tsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const FitBounds = ({ bounds }: { bounds: [number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds.length === 2) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);

  return null;
};

const ReactLeafletMap = ({
  pickup,
  drop,
}: {
  pickup: { lat: string; lon: string; display_name: string } | null;
  drop: { lat: string; lon: string; display_name: string } | null;
}) => {
  if (!pickup || !drop) return <div>Loading map...</div>;

  const pickupCoords: [number, number] = [
    parseFloat(pickup.lat),
    parseFloat(pickup.lon),
  ];
  const dropCoords: [number, number] = [
    parseFloat(drop.lat),
    parseFloat(drop.lon),
  ];
  const bounds: [number, number][] = [pickupCoords, dropCoords];

  return (
    <MapContainer
      className="w-full h-[450px]"
      center={pickupCoords}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Marker position={pickupCoords} />
      <Marker position={dropCoords} />

      <Polyline
        positions={[pickupCoords, dropCoords]}
        color="blue"
        weight={4}
      />

      <FitBounds bounds={bounds} />
    </MapContainer>
  );
};

export default ReactLeafletMap;
