import { useNavigate } from "react-router";

export const DriverAvailableRides = () => {
const Navigate = useNavigate();
  const handleClick = () => {
    // call backend to accept ride
    // create signalr connection
    // and send ride accepted message
    Navigate("current-ride")
  };

  return (
    <>
      <div className="border p-3 rounded-lg flex">
        <div>DriverAvailableRides</div>
        <div className="flex ml-auto gap-2">
          <button className="border p-1 hover:cursor-pointer" onClick={handleClick}>
            Accept
          </button>
          <button className="border p-1 hover:cursor-pointer">Decline</button>
        </div>
      </div>
    </>
  );
};
