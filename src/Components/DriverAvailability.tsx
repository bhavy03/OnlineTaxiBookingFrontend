import * as signalR from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { DriverAvailableRides } from "../Pages/DriverAvailableRides";

export const DriverAvailability = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const DRIVER_ID = localStorage.getItem("userEmail");

  const handleToggleAvailability = async () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability); 
    await updateAvailabilityOnBackend(newAvailability);
  };

  const updateAvailabilityOnBackend = async (status: boolean) => {
    try {
      const url = new URL(
        "https://localhost:7011/driver/Ride/set-availability"
      );
      if (DRIVER_ID === null) {
        toast.error("Driver ID not found");
        return;
      }
      url.searchParams.append("status", status.toString());
      url.searchParams.append("email", DRIVER_ID);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include Authorization header if your API requires it
          // "Authorization": `Bearer ${localStorage.getItem("driverAuthToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Driver availability updated:", data);
      toast.success(`Driver is now ${status ? "available" : "unavailable"}.`);
    } catch (error) {
      console.error("Error updating driver availability:", error);
      setIsAvailable(!status);
    }
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const url = new URL("https://localhost:7011/driver/Ride/get-availibility");
        if (DRIVER_ID === null) {
          toast.error("Driver ID not found");
          return;
        }
        url.searchParams.append("email", DRIVER_ID);
        const response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIsAvailable(data.isAvailable); 
        // console.log("Driver availability fetched:", data);
      } catch (error) {
        console.error("Error fetching driver availability:", error);
      }
    };

    fetchAvailability();
  }, [DRIVER_ID]);

  useEffect(() => {
    const startSignalRConnection = async () => {
      try {
        connectionRef.current = new signalR.HubConnectionBuilder()
          .withUrl("https://localhost:7011/rides")
          .withHubProtocol(new signalR.JsonHubProtocol())
          .configureLogging(signalR.LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        connectionRef.current.onreconnected(() => {
          console.log(
            "SignalR reconnected. Resending availability and starting location updates if available."
          );
          if (
            connectionRef.current &&
            connectionRef.current.state === signalR.HubConnectionState.Connected
          ) {
            // connectionRef.current.invoke(
            //   "SetDriverAvailability",
            //   DRIVER_ID,
            //   isAvailable
            // );
            if (isAvailable) {
              startLocationUpdates();
            } else {
              stopLocationUpdates();
            }
          }
        });

        connectionRef.current?.on(
          "ReceiveDriverLocationUpdate",
          (latitude, longitude) => {
            console.log(
              `Driver location updated: Latitude: ${latitude}, Longitude: ${longitude}`
            );
          }
        );

        await connectionRef.current.start();
        console.log("SignalR connection established.");

        if (
          connectionRef.current &&
          connectionRef.current.state === signalR.HubConnectionState.Connected
        ) {
          // connectionRef.current.invoke(
          //   "SetDriverAvailability",
          //   DRIVER_ID,
          //   isAvailable
          // );
          if (isAvailable) {
            startLocationUpdates();
          } else {
            stopLocationUpdates();
          }
        }
      } catch (err) {
        console.error("Error starting SignalR connection:", err);
      }
    };

    const startLocationUpdates = () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      locationIntervalRef.current = setInterval(() => {
        if (
          navigator.geolocation &&
          connectionRef.current &&
          connectionRef.current.state ===
            signalR.HubConnectionState.Connected &&
          isAvailable
        ) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              connectionRef.current?.invoke(
                "UpdateDriverLocation",
                latitude,
                longitude,
                DRIVER_ID
              );
            },
            (error) => {
              console.error("Error getting geolocation:", error);
              stopLocationUpdates();
              setIsAvailable(false);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        }
      }, 3000);
    };

    const stopLocationUpdates = () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };

    startSignalRConnection();

    return () => {
      stopLocationUpdates();
      if (connectionRef.current) {
        connectionRef.current
          .stop()
          .then(() => console.log("SignalR connection stopped."));
      }
    };
  }, [DRIVER_ID, isAvailable]);

  return (
    <>
      <div className="flex h-96">
        <div className="w-1/3">
          <div className="p-4 flex items-center justify-between border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Driver Availability
            </h2>
            <label
              htmlFor="availability-switch"
              className="flex items-center cursor-pointer"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  id="availability-switch"
                  className="sr-only" // Hide the default checkbox
                  checked={isAvailable}
                  onChange={handleToggleAvailability}
                />
                <div
                  className={`block w-14 h-8 rounded-full ${
                    isAvailable ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
                    isAvailable ? "translate-x-full" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-gray-700 font-medium">
                {isAvailable ? "Online" : "Offline"}
              </span>
            </label>
          </div>
          <div className="flex flex-col mt-10 gap-12 text-lg font-semibold">
            <Link
              to="accepted-rides"
              className="flex border items-center p-4 rounded-lg"
            >
              Accepted rides
            </Link>
            <Link
              to="declined-rides"
              className="flex border items-center p-4 rounded-lg"
            >
              Declined Rides
            </Link>
          </div>
        </div>
        {isAvailable ? (
          <div className="ml-4 border rounded-lg w-2/3 p-3 ">
            <DriverAvailableRides />
          </div>
        ) : (
          <div className="ml-4 border rounded-lg w-2/3 p-3 ">
            <h2 className="text-lg font-semibold text-gray-800">
              No rides available
            </h2>
          </div>
        )}
      </div>
    </>
  );
};
