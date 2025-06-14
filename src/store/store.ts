import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "../features/locationSlice";
import userReducer from "../features/userSlice";
import { locationIQApi } from "../services/LocationIQAPI";
import { BackendApi } from "../services/BackendAPIs";

export const store = configureStore({
  reducer: {
    [locationIQApi.reducerPath]: locationIQApi.reducer,
    [BackendApi.reducerPath]: BackendApi.reducer,
    location: locationReducer,
    user: userReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      locationIQApi.middleware,
      BackendApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
