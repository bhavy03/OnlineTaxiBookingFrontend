export type RideInfo = {
  rideId: string;
  accepted: boolean;
  carInfo: {
    carType: string;
    estimatedFare: number;
    distanceKm: number;
  };
  pickupName: string;
  dropName: string;
  coords: {
    pickupLat: number;
    pickupLon: number;
    dropLat: number;
    dropLon: number;
  };
  userEmail: string;
};
