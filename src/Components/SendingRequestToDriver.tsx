import { useEffect, useRef, useState } from "react";
import { UserCurrentRide } from "../Pages/UserCurrentRide";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import * as signalR from "@microsoft/signalr";
import React from "react";
import type { RideInfo } from "../types/RideInfo";

interface SendingRequestToDriverProps {
  connectionId: string;
  signalRConnection: signalR.HubConnection | null;
}

export const SendingRequestToDriver = React.memo(
  ({ connectionId, signalRConnection }: SendingRequestToDriverProps) => {
    const [accepted, setAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rideDriverInfo, setRideDriverInfo] = useState(" ");
    const [currentRideInfo, setCurrentRideInfo] = useState<RideInfo | null>(
      null
    );
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeLeftRef = useRef(30);
    const navigate = useNavigate();
    console.log("User Connection ID:", connectionId);

    useEffect(() => {
      if (!accepted) {
        setIsLoading(true);
        intervalRef.current = setInterval(() => {
          timeLeftRef.current -= 1;
          if (timeLeftRef.current <= 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setIsLoading(false);
            if (!accepted) {
              toast.error(
                "No Drivers available at the moment. Please try again later."
              );
              const usermail = localStorage.getItem("userEmail");
              signalRConnection?.invoke("RemoveRide", usermail);
              signalRConnection?.off("ReceiveDriverLocationUpdate");
              navigate("/user");
            }
          }
          console.log("Time left:", timeLeftRef.current);
        }, 1000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsLoading(false);
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [accepted, navigate, signalRConnection]);

    useEffect(() => {
      const StartConnection = async () => {
        try {
          if (
            signalRConnection &&
            signalRConnection.state === signalR.HubConnectionState.Connected
          ) {
            signalRConnection?.on(
              "ReceiveDriverResponse",
              (ride, driverInfo) => {
                if (driverInfo) {
                  setRideDriverInfo(driverInfo);
                  setCurrentRideInfo(ride);
                  setAccepted(true);
                  signalRConnection.off("ReceiveDriverLocationUpdate");
                } else {
                  toast.error("Currently no drivers available");
                }
              }
            );
            // return () => {
            //   console.log("Cleaning up 'ReceiveDriverResponse' listener.");
            //   signalRConnection.off("ReceiveDriverResponse", handleDriverResponse);
            // };
          } else {
            console.error(
              "SignalR connection not available or not connected in SendingRequestToDriver."
            );
          }
        } catch (error) {
          console.error("Error starting SignalR connection:", error);
        }
      };

      StartConnection();
    }, [signalRConnection]);

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">
            Waiting for Driver's response...
          </div>
        </div>
      );
    }

    return (
      <>
        <div>
          {accepted && (
            <UserCurrentRide
              rideDriverInfo={rideDriverInfo}
              signalRConnection={signalRConnection}
              currentRideInfo={currentRideInfo}
            />
          )}
        </div>
      </>
    );
  }
);
