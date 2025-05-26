export type RideInfo = {
  carInfo: {
    carType: string;
    estimatedFare: number;
    distanceKm: number;
  };
  coords: {
    pickupLat: number;
    pickupLon: number;
    dropLat: number;
    dropLon: number;
  };
  userEmail:string;
};
