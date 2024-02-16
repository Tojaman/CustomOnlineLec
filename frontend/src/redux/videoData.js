import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "videoData",
  initialState: {
    value: {
      videoURL: "",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      videoWidth: 0,
      videoHeight: 0,
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