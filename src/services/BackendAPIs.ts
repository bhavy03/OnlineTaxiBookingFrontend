// services/locationIQApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BackendApi = createApi({
  reducerPath: "BackendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7011/",
    // prepareHeaders: (headers) => {
    //   const token = import.meta.env.VITE_LOCATIONIQ_AUTH; // or any static/dynamic token
    //   if (token) {
    //     headers.set("Authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  endpoints: (builder) => ({
    getCarInfo: builder.query({
      query: ({pickupLat,pickupLon,dropLat,dropLon}) => ({
        url: `user/Ride/book-ride?pickLat=${pickupLat}&pickLon=${pickupLon}&dropLat=${dropLat}&dropLon=${dropLon}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCarInfoQuery } = BackendApi;

// navigator.geolocation.watchPosition((position) => {
//     const { latitude, longitude } = position.coords;
//     // Call distance API here if needed
//   });
