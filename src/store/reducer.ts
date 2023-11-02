import { combineReducers } from "@reduxjs/toolkit";
import questionsSlice from "./slice/questionsSlice";
import slotSlice from "./slice/slotSlice";
import analyticsSlice from "./slice/analyticsSlice";

const rootReducer = combineReducers({
  questions: questionsSlice,
  slots: slotSlice,
  analytics: analyticsSlice,
});

export default rootReducer;
