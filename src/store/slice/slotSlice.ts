import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Slot } from "../../types/Slot";

interface InitState {
  slotData: Slot | null;
  error: string | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: InitState = {
  slotData: null,
  error: null,
  loading: "idle",
};

export const fetchSlots = createAsyncThunk("slots/fetchSlots", async () => {
  try {
    const response = await fetch(
      "https://47e1t6n962.execute-api.ap-southeast-1.amazonaws.com/dev/lexListSlots"
    );
    const data = await response.json();
    return data.lexResponse;
  } catch (error) {
    return error as Error;
  }
});

export const createSlot = createAsyncThunk(
  "slots/createSlot",
  async (slot: any) => {
    try {
      const response = await fetch("http://localhost:8000/lexCreateSlot", {
        method: "PUT",
        body: JSON.stringify(slot),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return error as Error;
    }
  }
);

export const updateSlot = createAsyncThunk(
  "slots/updateSlot",
  async (slot: any) => {
    try {
      const response = await fetch("http://localhost:8000/lexUpdateSlot", {
        method: "PUT",
        body: JSON.stringify(slot),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return error as Error;
    }
  }
);

export const buildSlot = createAsyncThunk("slots/buildSlot", async () => {
  try {
    const response = await fetch("http://localhost:8000/lexbuild", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error as Error;
  }
});

export const deleteSlot = createAsyncThunk(
  "slots/deleteSlot",
  async (id: string) => {
    try {
      const response = await fetch("http://localhost:8000/lexDeleteSlot", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotId: id,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return error as Error;
    }
  }
);

export const slotSlice = createSlice({
  name: "slots",
  initialState,
  reducers: {
    test: () => {
      console.log("test");
    },
  },
  extraReducers(builder) {
    builder
      //fetchSlots
      .addCase(fetchSlots.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchSlots.fulfilled, (state, action) => {
        state.slotData = action.payload;
        // console.log(state.slotData);
        state.loading = "succeeded";
      })
      .addCase(fetchSlots.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "An error occurred";
      })
      //createSlot
      .addCase(createSlot.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createSlot.fulfilled, (state, action) => {
        // console.log(state.slotData);
        state.loading = "succeeded";
      })
      .addCase(createSlot.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "An error occurred";
      })
      //buildSlot
      .addCase(buildSlot.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(buildSlot.fulfilled, (state, action) => {
        // console.log(state.slotData);
        state.loading = "succeeded";
      })
      .addCase(buildSlot.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "An error occurred";
      })
      //deleteSlot
      .addCase(deleteSlot.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteSlot.fulfilled, (state, action) => {
        // console.log(state.slotData);
        state.loading = "succeeded";
      })
      .addCase(deleteSlot.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { test } = slotSlice.actions;

export default slotSlice.reducer;
