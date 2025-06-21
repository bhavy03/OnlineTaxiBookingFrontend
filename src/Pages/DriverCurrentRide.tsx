import CurrentRideMap from "../Components/CurrentRideMap";
import { useEffect, useRef, useState } from "react";
import type { UserData } from "../types/UserData";
import type { RideInfo } from "../types/RideInfo";
import toast from "react-hot-toast";

interface DriverCurrentRideProps {
  currentRideData: RideInfo | undefined;
  signalRConnection: signalR.HubConnection | null;
}
export const DriverCurrentRide = ({
  currentRideData,
  signalRConnection,
}: DriverCurrentRideProps) => {
  const [userData, setUserData] = useState<UserData>();
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("taxiToken");
        const url = new URL("https://localhost:7011/user/Ride/send-details");
        if (currentRideData?.userEmail != null) {
          url.searchParams.append("email", currentRideData.userEmail);
        }
        if (!token) {
          console.error("Authentication token is missing");
        }
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching driver availability:", error);
      }
    };

    fetchUserData();
  }, [currentRideData?.userEmail]);

  useEffect(() => {
    const startSignalRConnection = async () => {
      try {
        const cartype = localStorage.getItem("CarType");
        navigator.geolocation.watchPosition((position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          signalRConnection
            ?.invoke(
              "SendCurrentLocation",
              position.coords.latitude,
              position.coords.longitude,
              currentRideData?.rideId,
              cartype
            )
            .catch(() => console.error("Method not invoked"));
        });
      } catch (err) {
        console.error("Error starting SignalR connection:", err);
      }
    };

    startSignalRConnection();
    // return () => navigator.geolocation.clearWatch(watchId);
  }, [currentRideData?.rideId, signalRConnection]);

  useEffect(() => {
    signalRConnection?.on("RideCancelledFromUser", (rideId) => {
      console.log("Ride cancelled by user:", rideId);
      toast.error("Current Ride Cancelled");
      intervalRef.current = setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [signalRConnection]);

  const pickups = {
    lat: currentRideData?.coords.pickupLat || 0,
    lon: currentRideData?.coords.pickupLon || 0,
  };

  const drops = {
    lat: currentRideData?.coords.dropLat || 0,
    lon: currentRideData?.coords.dropLon || 0,
  };

  const completeRideClick = () => {
    const driverMail = localStorage.getItem("userEmail");
    if (!driverMail) {
      console.error("Driver email not found in local storage.");
      return;
    }
    signalRConnection?.invoke(
      "SetRideCompleted",
      currentRideData?.rideId,
      currentRideData?.userEmail,
      driverMail
    );
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-inter">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden md:h-[calc(100vh-6rem)]">
        <div className="w-full md:w-2/5 p-6 flex flex-col gap-y-5 border-b md:border-r border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Current Ride
          </h2>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-xl shadow-sm border border-violet-200">
            <p className="text-sm text-violet-700 font-medium flex items-center mb-1">
              <svg
                className="w-5 h-5 mr-2 text-violet-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Customer Name
            </p>
            <p className="text-lg font-bold text-violet-900">
              {userData?.userName || "N/A"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl shadow-sm border border-blue-200">
            <p className="text-sm text-blue-700 font-medium flex items-center mb-1">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.752 11.127l-.73-.73a1 1 0 00-1.414 0L11 11.586l-1.608-1.608a1 1 0 00-1.414 0L6.248 11.127l-.73-.73a1 1 0 00-1.414 0L2 11.586V11a1 1 0 00-1-1H.5A.5.5 0 000 10.5v1A.5.5 0 00.5 12H1a1 1 0 001 1v.586l1.608 1.608a1 1 0 001.414 0L8 12.414l1.608 1.608a1 1 0 001.414 0l1.608-1.608V14a1 1 0 001 1h.5a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5H14a1 1 0 00-1-1v-.586l-1.608-1.608zM10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              Customer Phone Number
            </p>
            <p className="text-lg font-bold text-blue-900">
              {userData?.userPhoneNo || "N/A"}
            </p>
          </div>

          <button
            className="w-full mt-3 py-3 px-6 rounded-xl bg-green-600 text-white font-semibold text-lg shadow-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={completeRideClick}
          >
            Complete Ride
          </button>
        </div>
        <div className="w-full md:w-3/5 p-6 flex flex-col items-center justify-center">
          <CurrentRideMap
            pickup={pickups}
            drop={drops}
            driverLatitude={latitude}
            driverLongitude={longitude}
          />
        </div>
      </div>
    </div>
  );
};
