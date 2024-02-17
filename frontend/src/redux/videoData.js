import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "videoData",
  initialState: {
    value: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      videoWidth: 100,
      videoHeight: 100,
    },
  },
  reducers: {
    videoData: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { videoData } = videoSlice.actions;

export default videoSlice.reducer;
