import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";
import car from "../assets/car.svg"; 
import "../index.css";
type Props = {
  pickup: { lat: number; lon: number };
  drop: { lat: number; lon: number };
  driverLatitude: number;
  driverLongitude: number;
};

const driverIcon = new L.Icon({
  iconUrl: car,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: "leaflet-div-icon icon-class", 
});

const DriverLocationMarker = ({
  driverLatitude,
  driverLongitude,
  pickup,
  drop,
}: Props) => {
  const map = useMap();
  const driverMarkerRef = useRef<L.Marker | null>(null); 

  useEffect(() => {
    if (driverLatitude !== 0 || driverLongitude !== 0) {
      if (!driverMarkerRef.current) {
        driverMarkerRef.current = L.marker([driverLatitude, driverLongitude],{icon: driverIcon})
          .bindPopup(`Driver's Current Location`)
          .addTo(map);
      } else {
        driverMarkerRef.current.setLatLng([driverLatitude, driverLongitude]);
      }

      const currentBounds = map.getBounds();
      const driverLatLng = L.latLng(driverLatitude, driverLongitude);
      if (!currentBounds.contains(driverLatLng)) {
        const newBounds = L.latLngBounds([
          [pickup.lat, pickup.lon],
          [drop.lat, drop.lon],
          [driverLatitude, driverLongitude],
        ]);
        map.fitBounds(newBounds, { padding: [50, 50], maxZoom: map.getZoom() });
      }
    } else {
      if (driverMarkerRef.current) {
        map.removeLayer(driverMarkerRef.current);
        driverMarkerRef.current = null;
      }
    }

    return () => {
      if (driverMarkerRef.current) {
        map.removeLayer(driverMarkerRef.current);
        driverMarkerRef.current = null;
      }
    };
  }, [map, driverLatitude, driverLongitude, pickup, drop]); 

  return null;
};

export default DriverLocationMarker;
