import { createSlice } from "@reduxjs/toolkit";

export const subtitleSlice = createSlice({
  name: "subtitle",
  initialState: {
    value: {
      saves: [],
    },
  },
  reducers: {
    subtitle: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { subtitle } = subtitleSlice.actions;

export default subtitleSlice.reducer;
