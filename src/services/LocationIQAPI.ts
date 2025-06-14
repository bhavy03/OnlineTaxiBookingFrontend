import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const locationIQApi = createApi({
  reducerPath: "locationIQApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://us1.locationiq.com/v1/",
  }),
  endpoints: (builder) => ({
    getAutocomplete: builder.query({
      query: (search: string) => ({
        url: `autocomplete?key=${import.meta.env.VITE_LOCATIONIQ_KEY}&q=${encodeURIComponent(search)}&format=json`,
        method: "GET",
      }),
    }),
    getDistance: builder.query({
      query: ({ startLat, startLon, endLat, endLon }) =>
        `directions/driving/${startLon},${startLat};${endLon},${endLat}?key=${import.meta.env.VITE_LOCATIONIQ_KEY}&overview=false`,
    }),
    getForwardGeocode: builder.query({
      query: (search: string) => ({
        url: `search/structured?street=${encodeURIComponent(search)}&key=${import.meta.env.VITE_LOCATIONIQ_KEY}&format=json`,
        method: "GET",
      }),
    }),
    getReverseGeocode: builder.query({
        query: ({lat,lon}) => ({
          url: `reverse?lat=${lat}&lon=${lon}&key=${import.meta.env.VITE_LOCATIONIQ_KEY}&format=json`,
          method: "GET",
        }),
      }),
  }),
});

export const { useGetAutocompleteQuery,useGetForwardGeocodeQuery,useGetReverseGeocodeQuery,useGetDistanceQuery } = locationIQApi;
