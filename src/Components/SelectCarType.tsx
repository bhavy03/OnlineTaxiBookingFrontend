import { useGetCarInfoQuery } from "../services/BackendAPIs";
import type { cartype } from "../types/carTypes";
import { v4 as uuidv4 } from "uuid";
import type { coordtype } from "../types/coordsType";
import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";

type UserRideDetailsFn = (car: cartype) => void;

interface SelectCarTypeProps {
  coords: coordtype;
  userRideDetails: UserRideDetailsFn;
}
const SelectCarType = React.memo(
  ({ coords, userRideDetails }: SelectCarTypeProps) => {
    const { data: carTypesData,isFetching,isLoading } = useGetCarInfoQuery(coords);
    const [selected, setIsSelected] = useState(" ");
    const [prevFare, setPrevFare] = useState(0);

    useEffect(() => {
      const fetchPrevAmount = async () => {
        try {
          const url = new URL("https://localhost:7011/user/Ride/prevAmout");
          const token = localStorage.getItem("taxiToken");
          if (!token) {
            console.error("Authorization token not found. Cannot fetch driver details.");
            // navigate('/login');
            return;
          }
    
          const userEmail = localStorage.getItem("userEmail");
          if (userEmail) {
            url.searchParams.append("email", userEmail);
          }
          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setPrevFare(data.prevAmount);
        } catch (error) {
          console.error("Error fetching prev amount:", error);
        }
      };

      fetchPrevAmount();
    }, []);

    const distance =
      carTypesData && carTypesData.length > 0
        ? carTypesData[0].distanceKm
        : null;
        
    return (
      <>
        <div className="flex-row overflow-hidden">
          <h2 className="mt-4 mb-2 font-bold">Select Service</h2>
          {(isFetching || isLoading) && (
            <div className="text-center text-gray-500">Loading car types...</div>
          )}
          <div className="flex-row">
            {carTypesData?.map((car: cartype) => (
              <div
                key={uuidv4()}
                className={`flex p-4 mb-2 border rounded shadow hover:bg-blue-100 cursor-pointer text-center ${selected == car.carType ? "bg-blue-200 border-blue-500 shadow-md hover:bg-blue-300" : "bg-white border-gray-200"}`}
                onClick={() => {
                  userRideDetails({
                    carType: car.carType,
                    estimatedFare:
                      car.estimatedFare + Number(prevFare.toFixed(2)),
                    distanceKm: car.distanceKm,
                  });
                  setIsSelected(car.carType);
                }}
              >
                <p>{car.carType}</p>
                <p className="ml-auto">{car.estimatedFare.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className=" flex rounded shadow bg-white">
            <div className="flex border p-2 border-gray-200 rounded shadow ">
              Distance
              <div className="ml-5 border border-gray-200 px-1 font-semibold rounded shadow bg-violet-100">
                {distance} Km
              </div>
            </div>

            {prevFare != 0 && (
              <div className="ml-5 flex border p-2 border-gray-200 rounded shadow ">
                <span>Outstanding Amount</span>
                <div className="flex align-middle font-semibold ml-5 border border-gray-200 px-1 rounded shadow bg-violet-100 ">
                  <div className="mt-1">
                    <FaRupeeSign />
                  </div>
                  {prevFare.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

export default SelectCarType;
