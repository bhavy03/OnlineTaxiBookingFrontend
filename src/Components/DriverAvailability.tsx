import * as signalR from "@microsoft/signalr";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { DriverAvailableRides } from "../Pages/DriverAvailableRides";
import type { RideInfo } from "../types/RideInfo";
import { DriverCurrentRide } from "../Pages/DriverCurrentRide";

export const DriverAvailability = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [rideRequests, setRideRequests] = useState<RideInfo[]>([]);
  const [userConnectionId, setUserConnectionId] = useState<string>("");
  const [anyCurrentRide, setAnyCurrentRide] = useState(false);
  const [currentRideData, setCurrentRideData] = useState<RideInfo>();
  const navigate = useNavigate();
  const DRIVER_ID = localStorage.getItem("userEmail");

  const handleToggleAvailability = async () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    await updateAvailabilityOnBackend(newAvailability);
  };

  const updateAvailabilityOnBackend = async (status: boolean) => {
    try {
      const token = localStorage.getItem("taxiToken");
      const url = new URL(
        "https://localhost:7011/driver/Ride/set-availability"
      );
      if (DRIVER_ID === null || token === null) {
        navigate("login");
        return;
      }
      url.searchParams.append("status", status.toString());
      url.searchParams.append("email", DRIVER_ID);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success(`Driver is now ${status ? "available" : "unavailable"}.`);
    } catch (error) {
      console.error("Error updating driver availability:", error);
      setIsAvailable(!status);
    }
  };

  const declineClick = (rideId: string) => {
    const updateList = rideRequests.filter((ride) => ride.rideId !== rideId);
    setRideRequests(updateList);
  };

  const removeAcceptedRide = (rideId: string) => {
    const updateList = rideRequests.filter((ride) => ride.rideId !== rideId);
    setRideRequests(updateList);
  };

  const removeNotAvailableRide = useCallback(
    (rideId: string) => {
      const updateList = rideRequests.filter((ride) => ride.rideId !== rideId);
      setRideRequests(updateList);
    },
    [rideRequests]
  );

  const setCurrentRide = (ride: RideInfo) => {
    setCurrentRideData(ride);
    setAnyCurrentRide(true);
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const token = localStorage.getItem("taxiToken");
        const url = new URL(
          "https://localhost:7011/driver/Ride/get-availibility"
        );
        if (DRIVER_ID === null || token === null) {
          console.error("No Driver id or no token found");
          return;
        }
        url.searchParams.append("email", DRIVER_ID);
        const response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIsAvailable(data);
      } catch (error) {
        console.error("Error fetching driver availability:", error);
      }
    };

    if (DRIVER_ID !== null) {
      fetchAvailability();
    }
  }, [DRIVER_ID]);

  useEffect(() => {
    const fetchCarType = async () => {
      try {
        const token = localStorage.getItem("taxiToken");
        const url = new URL("https://localhost:7011/driver/Ride/get-cartype");
        if (DRIVER_ID === null || token === null) {
          console.error("No Driver Id found");
          return;
        }
        url.searchParams.append("email", DRIVER_ID);
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
        localStorage.setItem("CarType", data?.carType);
      } catch (error) {
        console.error("Error fetching driver availability:", error);
      }
    };

    if (DRIVER_ID != null) {
      fetchCarType();
    }
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

        if (isAvailable) {
          connectionRef.current.on(
            "UserRideRequest",
            (userRideInfo, connectionId) => {
              console.log("Userrideinfo", userRideInfo);
              setRideRequests((prevRequests) => [
                ...prevRequests,
                userRideInfo,
              ]);
              setUserConnectionId(connectionId);
            }
          );

          connectionRef.current.on("getOldRides", (rides) => {
            setRideRequests(rides);
          });
        }

        await connectionRef.current.start();
        console.log("SignalR connection established.");

        if (
          connectionRef.current &&
          connectionRef.current.state === signalR.HubConnectionState.Connected
        ) {
          const cartype = localStorage.getItem("CarType");
          if (cartype != null && DRIVER_ID !== null) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              connectionRef.current
                ?.invoke(
                  "RegisterDriver",
                  latitude,
                  longitude,
                  DRIVER_ID,
                  cartype
                )
                .catch((err) =>
                  console.error("Error registering driver:", err)
                );
            });
            if (isAvailable) {
              startLocationUpdates();
            } else {
              stopLocationUpdates();
            }
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
          const cartype = localStorage.getItem("CarType");
          if (DRIVER_ID != null) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                connectionRef.current?.invoke(
                  "UpdateDriverLocation",
                  latitude,
                  longitude,
                  DRIVER_ID,
                  cartype
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
        }
      }, 3000);
    };

    const stopLocationUpdates = () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };

    if (isAvailable) {
      startSignalRConnection();
    }
  }, [DRIVER_ID, isAvailable]);

  useEffect(() => {
    connectionRef.current?.on("TimeoutRide", (rideId: string) => {
      removeNotAvailableRide(rideId);
    });

    connectionRef.current?.on("RideAlreadyAccepted", (rides: RideInfo) => {
      removeNotAvailableRide(rides.rideId);
    });
  }, [removeNotAvailableRide]);

  if (anyCurrentRide) {
    return (
      <DriverCurrentRide
        currentRideData={currentRideData}
        signalRConnection={connectionRef.current}
      />
    );
  } else {
    return (
      <>
        <div className="flex h-96">
          <div className="w-1/3">
            <div className="p-4 flex items-center justify-between border rounded-lg shadow-sm bg-violet-100 border-violet-400">
              <h2 className="text-lg font-semibold text-violet-700">
                Driver Availability{}
              </h2>
              <label
                htmlFor="availability-switch"
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="availability-switch"
                    key={isAvailable ? "available" : "unavailable"}
                    className="sr-only" 
                    checked={isAvailable}
                    onChange={handleToggleAvailability}
                  />
                  <div
                    className={`block w-14 h-8 rounded-full ${
                      isAvailable ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-violet-100 w-6 h-6 rounded-full transition transform ${
                      isAvailable ? "translate-x-full" : ""
                    }`}
                  ></div>
                </div>
                <span className="ml-3 text-violet-700 font-medium">
                  {isAvailable ? "Online" : "Offline"}
                </span>
              </label>
            </div>
            <div className="flex flex-col mt-10 gap-12 text-lg font-semibold ">
              <Link
                to="accepted-rides"
                className="flex border items-center p-4 rounded-lg bg-violet-100 border-violet-400 text-violet-700"
              >
                Accepted rides
              </Link>
            </div>
          </div>
          {isAvailable ? (
            <div className="ml-4 border rounded-lg w-2/3 p-3  border-violet-400 ">
              <DriverAvailableRides
                rideRequests={rideRequests}
                userConnectionId={userConnectionId}
                signalRConnection={connectionRef.current}
                declineClick={declineClick}
                removeAcceptedRide={removeAcceptedRide}
                setCurrentRide={setCurrentRide}
              />
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
  }
};

// connectionRef.current?.on(
//   "ReceiveDriverLocationUpdate",
//   (latitude, longitude) => {
//     console.log(
//       `Driver location updated: Latitude: ${latitude}, Longitude: ${longitude}`
//     );
//   }
// );

// return () => {
//   stopLocationUpdates();
//   if (connectionRef.current) {
//     connectionRef.current
//       .stop()
//       .then(() => console.log("SignalR connection stopped."));
//   }
// };

// if (isloading) {
//   return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
//     </div>
//   );
// }
