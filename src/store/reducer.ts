import { combineReducers } from "@reduxjs/toolkit";
import questionsSlice from "./slice/questionsSlice";
import slotSlice from "./slice/slotSlice";
import analyticsSlice from "./slice/analyticsSlice";
import geminiSlice from "./slice/geminiSlice";

const rootReducer = combineReducers({
  questions: questionsSlice,
  slots: slotSlice,
  analytics: analyticsSlice,
  gemini: geminiSlice,
});

export default rootReducer;
