// components/MapWithRouting.tsx
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

type Props = {
  pickup: { lat: number; lon: number };
  drop: { lat: number; lon: number};
};

// Routing Control Component
const RoutingControl = ({ pickup, drop }: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!pickup || !drop) return;

    // Create custom markers with popups
    const pickupMarker = L.marker([pickup.lat, pickup.lon])
      .bindPopup(`Pickup: ${pickup.lat || "Pickup Location"}`)
      .addTo(map);

    const dropMarker = L.marker([drop.lat, drop.lon])
      .bindPopup(`Drop: ${drop.lat || "Drop Location"}`)
      .addTo(map);

    // Fit map to bounds
    const bounds = L.latLngBounds([
      [pickup.lat, pickup.lon],
      [drop.lat, drop.lon],
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Add routing control
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(pickup.lat, pickup.lon), L.latLng(drop.lat, drop.lon)],
      routeWhileDragging: false,
      showAlternatives: false,
      addWaypoints: false,
    //   draggableWaypoints: false,
      fitSelectedRoutes: false, // we already did fitBounds
    //   createMarker: () => null, // prevent default markers
    }).addTo(map);

    return () => {
      routingControl.remove();
      map.removeLayer(pickupMarker);
      map.removeLayer(dropMarker);
    };
  }, [map, pickup, drop]);

  return null;
};

// Main Map Component
const CurrentRideMap = ({ pickup, drop }: Props) => {
  return (
    <MapContainer
      center={[pickup.lat, pickup.lon]}
      zoom={13}
      style={{ height: "450px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <RoutingControl pickup={pickup} drop={drop} />
    </MapContainer>
  );
};

export default CurrentRideMap;
