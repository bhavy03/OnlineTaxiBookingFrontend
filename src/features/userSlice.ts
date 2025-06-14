import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type userState = {
  isAuthenticated: boolean;
};

const initialState: userState = {
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "UserInfo",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setIsAuthenticated } = userSlice.actions;

export default userSlice.reducer;
