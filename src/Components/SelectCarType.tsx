import { useGetCarInfoQuery } from "../services/BackendAPIs";
// import { useAppSelector } from "../store/hooks";
import type { cartype } from "../types/carTypes";
import { v4 as uuidv4 } from "uuid";
import type { coordtype } from "../types/coordsType";

type UserRideDetailsFn = (car: cartype) => void;

interface SelectCarTypeProps {
  coords: coordtype;
  userRideDetails: UserRideDetailsFn;
}
function SelectCarType({ coords ,userRideDetails}: SelectCarTypeProps) {
  const { data: carTypesData } = useGetCarInfoQuery(coords);
  return (
    <>
      <div className="flex-row">
        <h2 className="mt-4 mb-2 font-bold">Select Service</h2>
        <div className="flex-row">
          {carTypesData?.map((car: cartype) => (
            <div
              key={uuidv4()}
              className="flex p-4 mb-2 border rounded shadow hover:bg-gray-100 cursor-pointer text-center"
              onClick={() => {
                userRideDetails(car);
              }}
            >
              <p>{car.carType}</p>
              <p className="ml-auto">{car.estimatedFare}</p>
            </div>
          ))}
        </div>
        <div className="border p-2 ">
          <div>Distance:</div>
          <div>{/* {carTypesData?[0].distanceKm} */}</div>
        </div>
      </div>
    </>
  );
}

export default SelectCarType;
