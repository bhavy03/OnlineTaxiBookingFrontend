import { useMap } from "react-leaflet";
import L from "leaflet";
import type { RecievedDriverInfo } from "../types/RecievedDriverInfo";
import { useEffect, useRef } from "react"; 
import car from "../assets/car.svg"; 
import "../index.css";

type DriverMarkersProps = {
  pickup: { lat: number; lon: number };
  drop: { lat: number; lon: number };
  nearbyDrivers: RecievedDriverInfo[];
};

const driverIcon = new L.DivIcon({
  className: 'custom-driver-marker',
  html: `
    <div style="
      background-color: transparent; /* Explicitly transparent background */
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    ">
      <img src="${car}" alt="Driver Car" style="width: 100%; height: 100%; object-fit: contain;">
    </div>
  `, 
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32],
});

const DriverMarkers = ({ pickup, drop, nearbyDrivers }: DriverMarkersProps) => {
  console.log("LENGTH", nearbyDrivers.length);
  const map = useMap();
  const driverMarkersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    const currentMarkers = driverMarkersRef.current; 

    const currentDriverEmails = new Set(
      nearbyDrivers.map((d) => d.driverEmail)
    );

    nearbyDrivers.forEach((driverInfo) => {
      const { driverEmail, driverLatitude, driverLongitude, driverCarType } =
        driverInfo;
      let marker = currentMarkers.get(driverEmail);

      if (marker) {
        marker.setLatLng([driverLatitude, driverLongitude]);
      } else {
        marker = L.marker([driverLatitude, driverLongitude], {
          icon: driverIcon,
        })
          .bindPopup(
            `<b>Driver: ${driverEmail}</b><br>Car Type: ${driverCarType}`
          )
          .addTo(map);
        currentMarkers.set(driverEmail, marker);
      }
    });

    currentMarkers.forEach((marker, email) => {
      if (!currentDriverEmails.has(email)) {
        map.removeLayer(marker); 
        currentMarkers.delete(email); 
      }
    });

    if (
      pickup.lat !== 0 ||
      pickup.lon !== 0 ||
      drop.lat !== 0 ||
      drop.lon !== 0
    ) {
      const allPoints: L.LatLngExpression[] = [
        [pickup.lat, pickup.lon],
        [drop.lat, drop.lon],
      ];
      nearbyDrivers.forEach((driver) => {
        allPoints.push([driver.driverLatitude, driver.driverLongitude]);
      });

      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      currentMarkers.forEach((marker) => {
        map.removeLayer(marker);
      });
      currentMarkers.clear();
    };
  }, [map, nearbyDrivers, pickup, drop]);

  return null; 
};

export default DriverMarkers;
