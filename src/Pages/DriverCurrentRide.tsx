import CurrentRideMap from "../Components/CurrentRideMap";

export const DriverCurrentRide = () => {
    const pickups = {
        lat: 26.9291996, 
        lon: 75.703282
      };
  
      const drops = {
        lat: 26.9181132,
        lon: 75.790129
      };

  return (
    <>
      <div>
        <div>User Phone No.</div>
        <div>
          <CurrentRideMap pickup={pickups} drop={drops} />
        </div>
      </div>
    </>
  );
};
