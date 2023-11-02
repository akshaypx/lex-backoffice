import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Question } from "../../types/Question";

interface InitState {
  list: Question[] | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  question: Question | null;
}

const initialState: InitState = {
  list: null,
  loading: "idle",
  error: null,
  question: null,
};

export const fetchData = createAsyncThunk("questions/fetchData", async () => {
  const response = await fetch(
    "https://630782983a2114bac7647b3a.mockapi.io/qna"
  );
  const data = await response.json();
  return data;
});

export const fetchSingleData = createAsyncThunk(
  "questions/fetchSingleData",
  async (id: number) => {
    const response = await fetch(
      `https://630782983a2114bac7647b3a.mockapi.io/qna/${id}`
    );
    const data = await response.json();
    return data;
  }
);

export const updateData = createAsyncThunk(
  "questions/updateData",
  async (question: Question) => {
    try {
      const response = await fetch(
        `https://630782983a2114bac7647b3a.mockapi.io/qna/${question.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(question),
        }
      );

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return error;
    }
  }
);

export const addData = createAsyncThunk(
  "questions/addData",
  async (question: Question) => {
    try {
      const response = await fetch(
        "https://630782983a2114bac7647b3a.mockapi.io/qna",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(question),
        }
      );

      //handle non 2xx errors
      if (!response.ok) {
        const errorData = await response.json();
        return errorData as Error;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return error;
    }
  }
);

export const deleteData = createAsyncThunk(
  "questions/deleteData",
  async (id: number) => {
    try {
      const response = await fetch(
        `https://630782983a2114bac7647b3a.mockapi.io/qna/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    test: () => {
      console.log("test");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "An error occurred";
      })
      .addCase(addData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addData.fulfilled, (state, action) => {
        state.list?.push(action.payload);
        state.loading = "succeeded";
      })
      .addCase(addData.rejected, (state, action) => {
        state.error = action.error.message || "Error adding data";
      })
      .addCase(deleteData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        if (state.list) {
          state.list = state.list?.filter(
            (data) => data.id !== action.payload.id
          );
        }
        state.loading = "succeeded";
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Error while deleting";
      })
      .addCase(fetchSingleData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchSingleData.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.question = action.payload;
      })
      .addCase(fetchSingleData.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "An error occurred";
      })
      .addCase(updateData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateData.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.question = action.payload;
        if (state.list) {
          state.list = state.list.map((value) => {
            if (value.id === action.payload.id) {
              // Replace the matching item with the updated item
              return action.payload;
            }
            return value;
          });
        }
      })
      .addCase(updateData.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { test } = questionsSlice.actions;

export default questionsSlice.reducer;
