import { useEffect, useRef, useState } from "react";
import EnteredLocation from "../Components/EnteredLocation";
import SelectCarType from "../Components/SelectCarType";
import SourceDestinationMap from "../Components/SourceDestinationMap";
import * as signalR from "@microsoft/signalr";
import { useParams } from "react-router";
import type { RecievedDriverInfo } from "../types/RecievedDriverInfo";
import type { cartype } from "../types/carTypes";
import type { RideInfo } from "../types/RideInfo";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { SendingRequestToDriver } from "../Components/SendingRequestToDriver";
import { useGetReverseGeocodeQuery } from "../services/LocationIQAPI";

function BookRide() {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<RecievedDriverInfo[]>([]);
  const [selectedCarType, setSelectedCarType] = useState<cartype | null>(null);
  const { pickupLat, pickupLon, dropLat, dropLon } = useParams();
  const [userConnectionId, setUserConnectionId] = useState<string>(" ");
  const [continueBooking, setContinueBooking] = useState(false);

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
            // console.log("Driver location updated now:", driverInfo);
            setNearbyDrivers((prevDrivers) => {
              const existingDriverIndex = prevDrivers.findIndex(
                (driver) => driver.driverEmail === driverInfo.driverEmail
              );

              if (existingDriverIndex !== -1) {
                const updatedDrivers = [...prevDrivers];
                updatedDrivers[existingDriverIndex] = {
                  ...updatedDrivers[existingDriverIndex],
                  driverLatitude: driverInfo.driverLatitude,
                  driverLongitude: driverInfo.driverLongitude,
                  driverCarType: driverInfo.driverCarType,
                  driverConnectionId: driverInfo.driverConnectionId,
                };
                return updatedDrivers;
              } else {
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
          const userId = localStorage.getItem("userEmail") || "";
          await connectionRef.current.invoke(
            "SetUserLocation",
            userId,
            Latitude,
            Longitude
          );
        } else {
          console.error("Pickup location not found");
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

  const handleClick = () => {
    if (selectedCarType) {
      const RideInfo: RideInfo = {
        rideId: uuidv4(),
        accepted: false,
        carInfo: selectedCarType,
        coords: coords,
        userEmail: localStorage.getItem("userEmail") || "",
        pickupName: pickupCordsDisplayData?.display_name,
        dropName: dropCordsDisplayData?.display_name,
      };
      console.log("RideInfo:", RideInfo, nearbyDrivers);
      if (connectionRef.current) {
        connectionRef.current
          .invoke("RequestNearbyDrivers", RideInfo, nearbyDrivers)
          .then(() => {
            toast.success("Request sent to nearby drivers.");
            setContinueBooking(true);
          })
          .catch(() => {
            toast.error("Error requesting nearby drivers:");
          });
      } else {
        toast.error("SignalR connection is not established.");
      }
    } else {
      toast.error("Please select a car type before booking.");
    }
  };

  if (continueBooking) {
    return (
      <SendingRequestToDriver
        connectionId={userConnectionId}
        signalRConnection={connectionRef.current}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main className="flex flex-grow flex-row my-2 mx-20 p-4">
          <div className="m-2 w-3/5">
            <EnteredLocation
              pickupName={pickupCordsDisplayData?.display_name}
              dropName={dropCordsDisplayData?.display_name}
            />
            <SelectCarType coords={coords} userRideDetails={userRideDetails} />
          </div>
          <div className="m-2 w-2/5 flex flex-col flex-grow overflow-hidden z-0">
            <SourceDestinationMap
              coords={coords}
              nearbyDrivers={nearbyDrivers}
            />
          </div>
        </main>

        <div className="sticky bottom-0 bg-white z-100">
          <hr className="border-blue-300" />
          <footer className="my-4 mx-20 p-4 border bg-blue-100 border-blue-300 shadow rounded z-10 hover:cursor-pointer hover:bg-blue-200 ">
            <button
              className="flex mx-auto text-blue-600 font-semibold hover:cursor-pointer"
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
