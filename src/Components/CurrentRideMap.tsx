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

// type RoutingControlProps = {
//   pickup: { lat: number; lon: number };
//   drop: { lat: number; lon: number };
// };

// const pickupIcon = L.icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
// });
// const dropIcon = L.icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
// });

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

const RoutingControl = ({ pickup, drop,driverLatitude,driverLongitude }: Props) => {
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
      // createMarker: () => null, // prevent default markers
      fitSelectedRoutes: true, 
    }).addTo(map);

    const routingControlDriver = L.Routing.control({
      waypoints: [
        L.latLng(pickup.lat, pickup.lon),
        L.latLng(driverLatitude, driverLongitude),
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      addWaypoints: false,
      // draggableWaypoints: false,
      fitSelectedRoutes: true, 
    }).addTo(map);

    map.routingControl = routingControl;
    map.routingControl = routingControlDriver;

    return () => {
      if (map.routingControl) {
        map.removeControl(map.routingControl);
        map.routingControl = null;
      }
    };
  }, [map, pickup, drop, driverLatitude, driverLongitude]);
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
      <RoutingControl pickup={pickup} drop={drop} driverLatitude={driverLatitude} driverLongitude={driverLongitude} />
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
