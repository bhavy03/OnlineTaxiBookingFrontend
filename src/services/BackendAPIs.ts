import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BackendApi = createApi({
  reducerPath: "BackendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7011/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("taxiToken");
      if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    }),
    endpoints: (builder) => ({
      getCarInfo: builder.query({
        query: ({ pickupLat, pickupLon, dropLat, dropLon }) => ({
          url: `user/Ride/book-ride?pickLat=${pickupLat}&pickLon=${pickupLon}&dropLat=${dropLat}&dropLon=${dropLon}`,
          method: "GET",
        }),
      }),
    }),
  });

export const { useGetCarInfoQuery } = BackendApi;
