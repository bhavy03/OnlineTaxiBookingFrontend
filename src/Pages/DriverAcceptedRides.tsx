import { useEffect, useState } from "react";
import type { AcceptedRideInfo } from "../types/AcceptedRideInfo";
import toast from "react-hot-toast"; 

export const DriverAcceptedRides = () => {
  const [acceptedRides, setAcceptedRides] = useState<AcceptedRideInfo[]>([]);
  const driverEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchAcceptedRides = async () => {
      if (!driverEmail) {
        console.error(
          "Driver email not found in local storage. Cannot fetch accepted rides."
        );
        toast.error("Please log in to view your accepted rides.");
        return;
      }

      try {
        const url = new URL("https://localhost:7011/driver/Ride/accept-ride/");
        const token = localStorage.getItem("taxiToken");
        if (!token) {
          console.error(
            "Token not found in local storage. Cannot fetch accepted rides."
          );
        }
        url.searchParams.append("driverEmail", driverEmail);
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData.message || `HTTP error! Status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data: AcceptedRideInfo[] = await response.json();
        setAcceptedRides(data);
      } catch (error) {
        console.error("Error fetching accepted rides:", error);
      }
    };

    fetchAcceptedRides();
  }, [driverEmail]);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
        Your Completed Rides
      </h2>

      {acceptedRides.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
          <p className="text-lg">No completed rides found yet.</p>
          <p className="mt-2 text-sm">
            Keep driving to see your ride history here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {acceptedRides.map((ride, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <p className="text-sm font-medium text-gray-500">
                    Pickup Location:
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {ride.pickUpLocation}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm font-medium text-gray-500">
                    Drop-off Location:
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {ride.dropLocation}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
                <div className="bg-indigo-50 text-indigo-700 py-2 px-3 rounded-md font-medium text-sm">
                  Car Type: <span className="font-bold">{ride.carType}</span>
                </div>
                <div className="bg-green-50 text-green-700 py-2 px-3 rounded-md font-medium text-sm">
                  Distance:{" "}
                  <span className="font-bold">
                    {ride.distance?.toFixed(1) ?? "N/A"} km
                  </span>
                </div>
                <div className="bg-blue-50 text-blue-700 py-2 px-3 rounded-md font-medium text-sm">
                  Fare:{" "}
                  <span className="font-bold">
                    ₹ {ride?.rideAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
