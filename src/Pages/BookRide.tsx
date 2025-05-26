import { useEffect, useRef, useState } from "react";
import EnteredLocation from "../Components/EnteredLocation";
import SelectCarType from "../Components/SelectCarType";
import SourceDestinationMap from "../Components/SourceDestinationMap";
import * as signalR from "@microsoft/signalr";
import { useNavigate, useParams } from "react-router";
import type { RecievedDriverInfo } from "../types/RecievedDriverInfo";
import type { cartype } from "../types/carTypes";
import type { RideInfo } from "../types/RideInfo";
import toast from "react-hot-toast";

function BookRide() {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<RecievedDriverInfo[]>([]);
  const [selectedCarType, setSelectedCarType] = useState<cartype | null>(null);
  const { pickupLat, pickupLon, dropLat, dropLon } = useParams();
  const [userConnectionId, setUserConnectionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const parsedPickupLat = pickupLat ? parseFloat(pickupLat) : 0;
  const parsedPickupLon = pickupLon ? parseFloat(pickupLon) : 0;
  const parsedDropLat = dropLat ? parseFloat(dropLat) : 0;
  const parsedDropLon = dropLon ? parseFloat(dropLon) : 0;

  const coords = {
    pickupLat: parsedPickupLat,
    pickupLon: parsedPickupLon,
    dropLat: parsedDropLat,
    dropLon: parsedDropLon,
  };

  useEffect(() => {
    const startSignalRConnection = async () => {
      try {
        connectionRef.current = new signalR.HubConnectionBuilder()
          .withUrl("https://localhost:7011/rides")
          .withHubProtocol(new signalR.JsonHubProtocol())
          .configureLogging(signalR.LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        connectionRef.current.on("UserConnectionId", (ConnectionId) => {
          setUserConnectionId(ConnectionId);
        });
        
        connectionRef.current.on(
          "ReceiveDriverLocationUpdate",
          (driverInfo: RecievedDriverInfo) => {
            console.log("Driver location updated now:", driverInfo);
            // setNearbyDrivers((prevDrivers) => [...prevDrivers, driverInfo]);
            setNearbyDrivers((prevDrivers) => {
              const existingDriverIndex = prevDrivers.findIndex(
                (driver) =>
                  driver.driverConnectionId === driverInfo.driverConnectionId
              );

              if (existingDriverIndex !== -1) {
                // Driver exists, update their coordinates
                const updatedDrivers = [...prevDrivers];
                updatedDrivers[existingDriverIndex] = {
                  ...updatedDrivers[existingDriverIndex],
                  driverLatitude: driverInfo.driverLatitude,
                  driverLongitude: driverInfo.driverLongitude,
                };
                return updatedDrivers;
              } else {
                // New driver, add them to the array
                return [...prevDrivers, driverInfo];
              }
            });
          }
        );

        await connectionRef.current.start();
        const userpickupLat = coords.pickupLat;
        const userpickupLon = coords.pickupLon;

        if (
          userpickupLat &&
          userpickupLon &&
          connectionRef.current.state === signalR.HubConnectionState.Connected
        ) {
          const Latitude = userpickupLat;
          const Longitude = userpickupLon;
          const userId = localStorage.getItem("userId") || "";
          await connectionRef.current.invoke(
            "SetUserLocation",
            userId,
            Latitude,
            Longitude
          );
          // console.log("inside invoke", Latitude, Longitude);
        } else {
          console.warn("Pickup location not found or connection not active.");
        }
      } catch (err) {
        console.error("Error starting SignalR connection:", err);
      }
    };

    startSignalRConnection();
    // return () => {
    //   if (connectionRef.current) {
    //     connectionRef.current
    //       .stop()
    //       .then(() => console.log("SignalR connection stopped."));
    //   }
    // };
  }, [coords.pickupLat, coords.pickupLon]);

  const userRideDetails = (carType: cartype) => {
    setSelectedCarType(carType);
  };

  // console.log("Selected car type:", selectedCarType);
  const handleClick = () => {
    if (selectedCarType) {
      const RideInfo: RideInfo = {
        carInfo: selectedCarType,
        coords: coords,
        userEmail: localStorage.getItem("userEmail") || "",
      };
      console.log("RideInfo:", RideInfo, nearbyDrivers);
      if (connectionRef.current) {
        connectionRef.current
          .invoke("RequestNearbyDrivers", RideInfo, nearbyDrivers)
          .then(() => {
            toast.success("Request sent to nearby drivers.");
          })
          .catch((err) => {
            toast.error("Error requesting nearby drivers:", err);
          });
      } else {
        console.error("SignalR connection is not established.");
      }
      navigate(`/user/request-ride/${userConnectionId}`);
    } else {
      toast.error("Please select a car type before booking.");
    }
  };
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="flex my-2 mx-20 p-2 border">Here comes sign</header>

        <main className="flex flex-grow flex-row my-2 mx-20 p-4">
          <div className="m-2 w-3/5">
            <EnteredLocation coords={coords} />
            <SelectCarType coords={coords} userRideDetails={userRideDetails} />
          </div>
          <div className="m-2 w-2/5">
            <SourceDestinationMap
              coords={coords}
              nearbyDrivers={nearbyDrivers}
            />
          </div>
        </main>

        <div className="sticky bottom-0 bg-white z-10">
          <hr className="border-gray-300" />
          <footer className="my-4 mx-20 p-4 border bg-amber-400 rounded z-10">
            <button
              className="flex mx-auto text-gray-100"
              onClick={handleClick}
            >
              Continue Booking
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
export default BookRide;
