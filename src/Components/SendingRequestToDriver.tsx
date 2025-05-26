import { useEffect, useRef, useState } from "react";
import { UserCurrentRide } from "../Pages/UserCurrentRide";
import { useNavigate, useParams } from "react-router";
import * as signalR from "@microsoft/signalr";
import toast from "react-hot-toast";

export const SendingRequestToDriver = () => {
  const [accepted, setAccepted] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [count, setCount] = useState(0);
  const { UserConnectionId } = useParams();
  const navigate = useNavigate();
  console.log("User Connection ID:", UserConnectionId);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
    const StartConnection = async () => {
      try {
        connectionRef.current = new signalR.HubConnectionBuilder()
          .withUrl("https://localhost:7011/rides")
          .withHubProtocol(new signalR.JsonHubProtocol())
          .configureLogging(signalR.LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        connectionRef.current.on(
          "ReceiveDriverResponse",
          (response: boolean) => {
            console.log("Driver response received:", response);
            setAccepted(response);
          }
        );
      } catch (error) {
        console.error("Error starting SignalR connection:", error);
      }
    };
    StartConnection();
    return () => {
      console.log("Cleaning up SendingRequestToDriver component");
      clearInterval(timer);
    };
  }, []);


  useEffect(() => {
    const TIMEOUT_SECONDS = 30;
    if (count > TIMEOUT_SECONDS) {
      if (!accepted) {
        toast.error("No Drivers available at the moment. Please try again later.");
        navigate("/user"); 
      }
    }
  }, [count, accepted, navigate])
  
  return (
    <>
      <div>
        {accepted ? <UserCurrentRide /> : <div>SendingRequestToDriver</div>}
      </div>
    </>
  );
};
