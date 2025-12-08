export type LatLng = {
  lat: number;
  lng: number;
};

export type Ride = {
  id: number;
  driver_id?: string;
  pickup: string;
  pickupLatLng?: LatLng;
  destination: string;
  destinationLatLng?: LatLng;
  seats: number;
  startedAt?: Date | null;
  finishedAt?: Date | null;
  createdAt?: Date | null;
};
