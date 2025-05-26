import type { coordtype } from "../types/coordsType";
import type { RecievedDriverInfo } from "../types/RecievedDriverInfo";
import MapWithRouting from "./MapWithRouting";

interface SourceDestinationMapProps {
  coords: coordtype;
  nearbyDrivers: RecievedDriverInfo[];
}
const SourceDestinationMap = ({coords,nearbyDrivers}:SourceDestinationMapProps) => {
//   const pickup = useAppSelector(
//     (state) => state.location.suggestedPickup
//   );
//   const drop = useAppSelector(
//     (state) => state.location.suggestedDrop
//   );

    // type PickupType = {
    //   lat: number;
    //   lon: number;
    //   display_name: string | undefined;
    // };
    const pickups = {
      lat: coords.pickupLat, 
      lon: coords.pickupLon
    };

    const drops = {
      lat: coords.dropLat,
      lon: coords.dropLon
    };
    // console.log("pickups", pickups);
    // console.log("drops", drops);    

  //   const mapRef = useRef<HTMLDivElement>(null);
  //   const leafletMapRef = useRef<L.Map | null>(null);

  //   useEffect(() => {
  //     if (!mapRef.current || typeof L === "undefined") return;

  //     // Initialize map only once
  //     if (!leafletMapRef.current) {
  //       leafletMapRef.current = L.map(mapRef.current).setView(
  //         [26.9124, 75.7873], // default to Jaipur
  //         9
  //       );

  //       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //         attribution:
  //           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //       }).addTo(leafletMapRef.current);
  //     }

  //     const map = leafletMapRef.current;
  //     console.log("map", map);

  //     // Clear old markers
  //     map.eachLayer((layer: any) => {
  //       if (layer instanceof L.Marker) map.removeLayer(layer);
  //     });

  //     // Add pickup marker
  //     if (pickup?.lat && pickup?.lon) {
  //       const pickupMarker = L.marker([pickup.lat, pickup.lon])
  //         .addTo(map)
  //         .bindPopup("Pickup: " + pickup.display_name);
  //       map.setView([pickup.lat, pickup.lon], 13);
  //     }

  //     // Add drop marker
  //     if (drop?.lat && drop?.lon) {
  //       const dropMarker = L.marker([drop.lat, drop.lon])
  //         .addTo(map)
  //         .bindPopup("Drop: " + drop.display_name);
  //     }
  //   }, [pickup, drop]);

  {
    /* <div
        id="map"
        ref={mapRef}
        style={{ height: "450px", width: "100%", borderRadius: "10px" }}
      >
        <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Additional map layers or components can be added here */
  }
  //   </MapContainer>
  //   </div> */}

  return (
    <>
      <div className="h-full w-full">
        {/* <ReactLeafletMap pickup={pickup} drop={drop} /> */}
        <MapWithRouting pickup={pickups} drop={drops} nearbyDrivers={nearbyDrivers}/>
      </div>
    </>
  );
};

export default SourceDestinationMap;
