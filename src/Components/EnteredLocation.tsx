import { FaRegDotCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import type { LocationProps } from "../types/LocationProps";
import { useGetReverseGeocodeQuery } from "../services/LocationIQAPI";

function EnteredLocation({ coords }: LocationProps) {
  const pickupCoords = {
    lat: coords.pickupLat,
    lon: coords.pickupLon,
  };
  const dropCoords = {
    lat: coords.dropLat,
    lon: coords.dropLon,
  };

  const { data: pickupCordsDisplayData } =
    useGetReverseGeocodeQuery(pickupCoords);
  const { data: dropCordsDisplayData } = useGetReverseGeocodeQuery(dropCoords);

  return (
    <div className="bg-gray-100 p-2 rounded-lg border shadow-sm">
      <div className="flex gap-4">
        <div className="flex-col items-center">
          <FaLocationDot color="green" size={18} className="mt-1" />
          {/* <hr className="border-l-2 border-dashed border-gray-300 h-4" /> */}
          <FaRegDotCircle color="red" size={16} className="mt-4" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span className="text-sm text-gray-800">
            {pickupCordsDisplayData?.display_name}
          </span>

          <hr className="border-t border-gray-300 w-full" />

          <span className="text-sm text-gray-800">
            {dropCordsDisplayData?.display_name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default EnteredLocation;
