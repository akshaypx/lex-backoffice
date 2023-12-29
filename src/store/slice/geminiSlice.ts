import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  multiturnData:
    | {
        message: string;
      }[]
    | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  deleteHistory: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: InitialState = {
  multiturnData: null,
  loading: "idle",
  error: null,
  deleteHistory: "idle",
};

export const fetchMultiTurnData = createAsyncThunk(
  "gemini/fetchMultiTurnData",
  async (message: string) => {
    try {
      const response = await fetch("http://localhost:8000/multiturnchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ msg: message }),
      });
      const resData = await response.json();
      return resData;
    } catch (error) {
      return error;
    }
  }
);
export const deleteHistory = createAsyncThunk(
  "gemini/deleteHistory",
  async () => {
    try {
      await fetch("http://localhost:8000/destroyHistory");
    } catch (error) {
      return error;
    }
  }
);

export const geminiSlice = createSlice({
  name: "gemini",
  initialState,
  reducers: {
    test: () => {
      console.log("gemini slice test");
    },
    addToData: (state, action) => {
      if (state.multiturnData) {
        state.multiturnData?.push({ message: action.payload });
      } else {
        state.multiturnData = [{ message: action.payload }];
      }
    },
    clearLocalHistory: (state) => {
      state.multiturnData = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMultiTurnData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchMultiTurnData.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.deleteHistory = "idle";
        console.log(action.payload);
        if (state.multiturnData) {
          state.multiturnData.push({ message: action.payload.message });
        } else {
          state.multiturnData = [{ message: action.payload.message }];
        }
      })
      .addCase(fetchMultiTurnData.rejected, (state, action) => {
        state.loading = "failed";
        state.error =
          action.error.message || "Error while fetching Multi Turn Data";
      })
      .addCase(deleteHistory.pending, (state) => {
        state.deleteHistory = "pending";
      })
      .addCase(deleteHistory.fulfilled, (state) => {
        state.deleteHistory = "succeeded";
      })
      .addCase(deleteHistory.rejected, (state, action) => {
        state.deleteHistory = "failed";
        state.error = action.error.message || "Error while clearing history";
      });
  },
});

export const { test, clearLocalHistory, addToData } = geminiSlice.actions;

export default geminiSlice.reducer;
