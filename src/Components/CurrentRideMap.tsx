import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import DriverLocationMarker from "./DriverLocationMarker";

type Props = {
  pickup: { lat: number; lon: number };
  drop: { lat: number; lon: number };
  driverLatitude: number;
  driverLongitude: number;
};

type RoutingControlProps = {
  pickup: { lat: number; lon: number };
  drop: { lat: number; lon: number };
};

declare module "leaflet" {
  interface Map {
    routingControl?: L.Routing.Control | null;
  }
}

declare module "leaflet-routing-machine" {
  interface RoutingControlOptions {
    draggableWaypoints?: boolean;
    createMarker?: (
      i: number,
      waypoint: L.Routing.Waypoint,
      n: number
    ) => L.Marker | null;
  }
}

const RoutingControl = ({ pickup, drop }: RoutingControlProps) => {
  const map = useMap();

  useEffect(() => {
    if (
      !pickup ||
      !drop ||
      (pickup.lat === 0 && pickup.lon === 0) ||
      (drop.lat === 0 && drop.lon === 0)
    ) {
      if (map.routingControl) {
        map.removeControl(map.routingControl);
        map.routingControl = null;
      }
      return;
    }

    if (map.routingControl) {
      map.removeControl(map.routingControl);
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickup.lat, pickup.lon),
        L.latLng(drop.lat, drop.lon),
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      addWaypoints: false,
      // draggableWaypoints: false,
      fitSelectedRoutes: true, 
    }).addTo(map);

    map.routingControl = routingControl;

    return () => {
      if (map.routingControl) {
        map.removeControl(map.routingControl);
        map.routingControl = null;
      }
    };
  }, [map, pickup, drop]);
  return null;
};

const CurrentRideMap = ({
  pickup,
  drop,
  driverLatitude,
  driverLongitude,
}: Props) => {
  return (
    <MapContainer
      center={[pickup.lat, pickup.lon]}
      zoom={13}
      style={{ height: "350px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <RoutingControl pickup={pickup} drop={drop} />
      <DriverLocationMarker
        pickup={pickup}
        drop={drop}
        driverLatitude={driverLatitude}
        driverLongitude={driverLongitude}
      />
    </MapContainer>
  );
};

export default CurrentRideMap;
