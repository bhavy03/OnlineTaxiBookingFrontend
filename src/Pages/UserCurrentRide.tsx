import CurrentRideMap from "../Components/CurrentRideMap";

export const UserCurrentRide = () => {
  const pickups = {
    lat: 26.9291996,
    lon: 75.703282,
  };

  const drops = {
    lat: 26.9181132,
    lon: 75.790129,
  };

  return (
    <>
      <div className="flex w-full h-96">
        <div className="w-2/5">driverInfo</div>
        <div className="w-3/5 ">
          <CurrentRideMap pickup={pickups} drop={drops} />
        </div>
      </div>
    </>
  );
};
