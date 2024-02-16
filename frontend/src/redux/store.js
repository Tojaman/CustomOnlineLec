import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import videoReducer from "./videoData";
import subtitleReducer from "./subtitle";

const rootReducer = combineReducers({
  videoData: videoReducer,
  subtitle: subtitleReducer,
});

export default configureStore({
  reducer: rootReducer,
});
