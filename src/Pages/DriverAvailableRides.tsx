import type { RideInfo } from "../types/RideInfo";
import toast from "react-hot-toast";

type rideDeclineClick = (rideId: string) => void;
type CurrentRidetype = (ride: RideInfo) => void;
interface DriverAvailableRidesProps {
  rideRequests: RideInfo[];
  userConnectionId: string;
  signalRConnection: signalR.HubConnection | null;
  declineClick: rideDeclineClick;
  removeAcceptedRide: rideDeclineClick;
  setCurrentRide: CurrentRidetype;
}

export const DriverAvailableRides = ({
  rideRequests,
  userConnectionId,
  signalRConnection,
  declineClick,
  removeAcceptedRide,
  setCurrentRide,
}: DriverAvailableRidesProps) => {
  const driverEmail = localStorage.getItem("userEmail");

  const acceptClick = (ride: RideInfo) => {
    signalRConnection
      ?.invoke("SendAcceptedRequestToUser", ride, userConnectionId, driverEmail)
      .then(() => toast.success("Accepted ride request sent to user"))
      .catch(() => toast.error("Error sending request to user"));
    setCurrentRide(ride);
  };

  if (rideRequests.length == 0) {
    return (
      <>
        <div className="flex flex-col gap-5">
          <div className="font-semibold text-2xl text-violet-800">
            DriverAvailableRides
          </div>
          <div className="font-semibold text-violet-800">
            ❌ Currently No Rides Available....{" "}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="mb-2 text-violet-600 font-semibold">
          DriverAvailableRides
        </div>
        {rideRequests.map((ride) => (
          <li key={ride.rideId} className="list-none">
            <div className="border border-violet-500 p-3 rounded-lg flex bg-violet-200">
              <div className="flex-col ml-auto gap-2">
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="font-semibold mr-2">Pickup</div>
                    <div className="">{ride.pickupName}</div>
                  </div>
                  <div className="flex mt-2">
                    <div className="font-semibold mr-4">Drop</div>
                    <div>{ride.dropName}</div>
                  </div>
                </div>
                <div className="flex mt-3">
                  <div>
                    <span className="font-semibold">Distance - </span>{" "}
                    {ride.carInfo.distanceKm} KM
                  </div>
                  <div className="ml-8">
                    <span className="font-semibold">Fare - ₹</span>
                    {ride.carInfo.estimatedFare.toFixed(2)} 
                  </div>
                </div>
                <div className="flex mt-3">
                  <button
                    className="border p-1 px-2 hover:cursor-pointer rounded border-violet-700 bg-violet-200 text-violet-600"
                    onClick={() => {
                      acceptClick(ride);
                      removeAcceptedRide(ride.rideId);
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="border p-1 ml-3 px-2 hover:cursor-pointer rounded border-violet-700 bg-violet-200 text-violet-600"
                    onClick={() => declineClick(ride.rideId)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </>
    );
  }
};
