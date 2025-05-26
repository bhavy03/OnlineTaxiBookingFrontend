import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "../features/locationSlice";
import { locationIQApi } from "../services/LocationIQAPI";
import { BackendApi } from "../services/BackendAPIs";

export const store = configureStore({
  reducer: {
    [locationIQApi.reducerPath]: locationIQApi.reducer,
    [BackendApi.reducerPath]: BackendApi.reducer,
    location: locationReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(locationIQApi.middleware, BackendApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
