import { useEffect, useState } from "react";
import CurrentRideMap from "../Components/CurrentRideMap";
import type { DriverDetails } from "../types/DriverDetails";
import type { RideInfo } from "../types/RideInfo";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import * as signalR from "@microsoft/signalr";
import { CancelRideModal } from "../Components/CancelRideModal";
import { RatingModal } from "../Components/RatingModal";

interface UserCurrentRideProps {
  rideDriverInfo: string;
  signalRConnection: signalR.HubConnection | null;
  currentRideInfo: RideInfo | null;
}

export const UserCurrentRide = ({
  rideDriverInfo,
  signalRConnection,
  currentRideInfo,
}: UserCurrentRideProps) => {
  const [driverDetails, setDriverDetails] = useState<DriverDetails>();
  const [driverLat, setDriverLat] = useState(0);
  const [driverLon, setDriverLon] = useState(0);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRideDriverEmail, setCurrentRideDriverEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const url = new URL("https://localhost:7011/driver/Ride/send-details");
        const token = localStorage.getItem("taxiToken");
        if (!token) {
          console.error(
            "Authorization token not found. Cannot fetch driver details."
          );
          // navigate("login");
          return;
        }
        url.searchParams.append("email", rideDriverInfo);
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
        setDriverDetails(data);
      } catch (error) {
        console.error("Error fetching driver Details:", error);
      }
    };

    fetchDriverData();
  }, [rideDriverInfo]);

  useEffect(() => {
    const handleRideIsCompleted = (rideId: string, driverEmail: string) => {
      setCurrentRideDriverEmail(driverEmail);
      console.log(`Ride ${rideId} is completed for driver ${driverEmail}.`);
      setShowRatingModal(true);
    };

    signalRConnection?.on("RideIsCompleted", handleRideIsCompleted);

    return () => {
      signalRConnection?.off("RideIsCompleted", handleRideIsCompleted);
    };
  }, [navigate, signalRConnection]);

  useEffect(() => {
    signalRConnection?.on("DriverCurrentLocation", (driverLat, driverLon) => {
      setDriverLat(driverLat);
      setDriverLon(driverLon);
    });
  }, [signalRConnection]);

  const pickups = {
    lat: currentRideInfo?.coords.pickupLat || 0,
    lon: currentRideInfo?.coords.pickupLon || 0,
  };

  const drops = {
    lat: currentRideInfo?.coords.dropLat || 0,
    lon: currentRideInfo?.coords.dropLon || 0,
  };

  const openCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  let deductedRideAmount: number = 0;
  if (currentRideInfo?.carInfo.estimatedFare) {
    deductedRideAmount = currentRideInfo?.carInfo.estimatedFare * 0.05;
  }

  const handleGiveRating = async (ratingValue: number) => {
    if (!currentRideDriverEmail) {
      toast.error("Driver email not available to submit rating.");
      return;
    }
    const token = localStorage.getItem("taxiToken");
    if (!token) {
      toast.error("Authentication token missing. Cannot submit rating.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7011/user/Ride/rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          driverEmail: currentRideDriverEmail,
          RatingValue: ratingValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      toast.success(data.message || "Thank you for your rating!");
      setShowRatingModal(false);
      navigate("/user");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(`Failed to submit rating: ${(error as Error).message}`);
    }
  };

  const handleSkipRating = () => {
    toast("Rating skipped.", { icon: "👋" });
    setShowRatingModal(false);
    navigate("/user");
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!currentRideInfo) {
      console.error("No current ride info available to cancel.");
      return;
    }
    if (
      !signalRConnection ||
      signalRConnection.state !== signalR.HubConnectionState.Connected
    ) {
      toast.error("Real-time connection not active. Cannot cancel ride.");
      return;
    }

    try {
      // Invoke backend method to cancel the ride
      await signalRConnection?.invoke(
        "CancelRide",
        currentRideInfo.rideId,
        currentRideInfo.userEmail,
        deductedRideAmount,
        reason
      );
      toast.success("Ride cancellation request sent.");
      closeCancelModal();
      navigate("/user");
    } catch (error) {
      console.error("Error cancelling ride:", error);
      toast.error("Failed to cancel ride.");
    }
  };

  console.log("DRIVER CURRENT LOCATION:", driverLat, driverLon);

  return (
    <div className="min-h-screen  flex flex-col justify-center items-center px-2 font-inter">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden md:h-[calc(100vh-6rem)]">
        <div className="w-full md:w-2/5 p-4 flex flex-col gap-y-3 border-b md:border-r border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Your Ride Details
          </h2>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-xl shadow-sm border border-indigo-200">
            <p className="text-sm text-indigo-700 font-medium flex items-center mb-1">
              <svg
                className="w-5 h-5 mr-2 text-indigo-500"
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
              Captain Name
            </p>
            <p className="text-lg font-bold text-indigo-900">
              {driverDetails?.driverName || "N/A"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl shadow-sm border border-green-200">
            <p className="text-sm text-green-700 font-medium flex items-center mb-1">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
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
              Captain Phone Number
            </p>
            <p className="text-lg font-bold text-green-900">
              {driverDetails?.driverPhoneNo || "N/A"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl shadow-sm border border-yellow-200">
            <p className="text-sm text-orange-700 font-medium flex items-center mb-1">
              <svg
                className="w-5 h-5 mr-2 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3.5 5.75c0-.966.784-1.75 1.75-1.75h1.5A1.75 1.75 0 018.5 5.75v1.5a.75.75 0 001.5 0v-1.5a1.75 1.75 0 011.75-1.75h1.5A1.75 1.75 0 0115.5 5.75v1.5a.75.75 0 001.5 0v-1.5c0-1.795-1.455-3.25-3.25-3.25h-1.5A3.25 3.25 0 009.5 2.5v1.5a.75.75 0 001.5 0v-1.5a1.75 1.75 0 011.75-1.75h1.5c.966 0 1.75.784 1.75 1.75v1.5a.75.75 0 001.5 0v-1.5c0-1.795-1.455-3.25-3.25-3.25H5.25C3.455 2.5 2 3.955 2 5.75v1.5a.75.75 0 001.5 0v-1.5zM10.5 8a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V8zM5.75 10a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H5.75zM12.75 10a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM2 13.5a.75.75 0 001.5 0V12a.75.75 0 00-1.5 0v1.5zM16.5 12a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V12z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Captain Vehicle Number
            </p>
            <p className="text-lg font-bold text-orange-900">
              {driverDetails?.driverLicenseNo || "N/A"}
            </p>
          </div>

          <button
            className="w-full mt-3 py-3 px-6 rounded-xl bg-red-600 text-white font-semibold text-lg shadow-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={openCancelModal}
          >
            Cancel Ride
          </button>
        </div>
        <div className="w-full md:w-3/5 p-6 flex flex-col items-center justify-center z-0">
          <CurrentRideMap
            pickup={pickups}
            drop={drops}
            driverLatitude={driverLat}
            driverLongitude={driverLon}
          />
        </div>
      </div>
      <CancelRideModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirmCancel={handleConfirmCancel}
        rideAmount={deductedRideAmount ?? 0}
      />
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)} 
        onSubmitRating={handleGiveRating}
        driverName={driverDetails?.driverName}
        onSkip={handleSkipRating}
      />
    </div>
  );
};
