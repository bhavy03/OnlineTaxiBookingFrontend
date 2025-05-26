import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Suggestion } from "../types/Suggestion";

type locationState = {
  suggestedPickup: Suggestion | null;
  suggestedDrop: Suggestion | null;
};

const initialState: locationState = {
  suggestedPickup: null,
  suggestedDrop: null,
};

export const locationSlice = createSlice({
  name: "Location",
  initialState,
  reducers: {
    setSlicePickUp: (state, action: PayloadAction<Suggestion>) => {
      state.suggestedPickup = action.payload;
    },
    setSliceDrop: (state, action: PayloadAction<Suggestion>) => {
      state.suggestedDrop = action.payload;
    },
  },
});

export const { setSliceDrop, setSlicePickUp } = locationSlice.actions;

export default locationSlice.reducer;
