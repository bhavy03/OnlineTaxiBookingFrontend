import type { coordtype } from "../types/coordsType";
import type { RecievedDriverInfo } from "../types/RecievedDriverInfo";
import MapWithRouting from "./MapWithRouting";

interface SourceDestinationMapProps {
  coords: coordtype;
  nearbyDrivers: RecievedDriverInfo[];
}
const SourceDestinationMap = ({
  coords,
  nearbyDrivers,
}: SourceDestinationMapProps) => {
  const pickups = {
    lat: coords.pickupLat,
    lon: coords.pickupLon,
  };

  const drops = {
    lat: coords.dropLat,
    lon: coords.dropLon,
  };

  return (
    <>
      <div className="h-full w-full overflow-hidden">
        <MapWithRouting
          pickup={pickups}
          drop={drops}
          nearbyDrivers={nearbyDrivers}
        />
      </div>
    </>
  );
};

export default SourceDestinationMap;
