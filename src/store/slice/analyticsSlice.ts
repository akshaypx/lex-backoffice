import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IntentMetrics } from "../../types/IntentMetrics";
import { UtteranceMetrics } from "../../types/UtteranceMetrics";
import {
  UtteranceAnalytics,
  UtterancesEntity,
} from "../../types/UtteranceAnalytics";

interface InitialState {
  data: string | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  intentMetrics: IntentMetrics | null;
  utteranceMetrics: UtteranceMetrics | null;
  utteranceAnalyticsData: UtteranceAnalytics | null;
  intentDistribution: Record<string, number>;
  slotUsage: Record<string, number>;
  responseTypes: Record<string, number>;
  understoodUtterances: number;
}

const initialState: InitialState = {
  data: null,
  loading: "idle",
  error: null,
  intentMetrics: null,
  utteranceMetrics: null,
  utteranceAnalyticsData: null,
  intentDistribution: {},
  slotUsage: {},
  responseTypes: {},
  understoodUtterances: 0,
};

export const fetchIntentMetrics = createAsyncThunk(
  "analytics/fetchIntentMetrics",
  async () => {
    try {
      const response = await fetch(
        "https://47e1t6n962.execute-api.ap-southeast-1.amazonaws.com/dev/listIntentMetrics"
      );
      const data = await response.json();
      return data;
    } catch (err) {
      return err;
    }
  }
);

export const fetchUtteranceMetrics = createAsyncThunk(
  "analytics/fetchUtteranceMetrics",
  async () => {
    try {
      const response = await fetch(
        "https://47e1t6n962.execute-api.ap-southeast-1.amazonaws.com/dev/listUtteranceMetrics"
      );
      const data = await response.json();
      return data;
    } catch (err) {
      return err;
    }
  }
);

export const fetchUtteranceAnalyticsData = createAsyncThunk(
  "analytics/fetchUtteranceAnalyticsData",
  async () => {
    try {
      const response = await fetch(
        "https://47e1t6n962.execute-api.ap-southeast-1.amazonaws.com/dev/listUtteranceAnalyticsData"
      );
      const data = await response.json();
      return data;
    } catch (err) {
      return err;
    }
  }
);

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    test: () => {
      console.log("test");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchIntentMetrics.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchIntentMetrics.fulfilled, (state, action) => {
        state.intentMetrics = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchIntentMetrics.rejected, (state, action) => {
        state.loading = "failed";
        state.error =
          action.error.message || "Error while fetching intent metrics";
      })
      .addCase(fetchUtteranceMetrics.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUtteranceMetrics.fulfilled, (state, action) => {
        state.utteranceMetrics = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchUtteranceMetrics.rejected, (state, action) => {
        state.loading = "failed";
        state.error =
          action.error.message || "Error while fetching Utterance metrics";
      })
      .addCase(fetchUtteranceAnalyticsData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUtteranceAnalyticsData.fulfilled, (state, action) => {
        state.utteranceAnalyticsData = action.payload;
        state.loading = "succeeded";

        // Calculate intentDistribution, slotUsage, responseTypes, and understoodUtterances
        const data = action.payload; // Assuming data is in the expected format

        if (data && data.utterances) {
          const intentDistribution: Record<string, number> = {};
          const slotUsage: Record<string, number> = {};
          const responseTypes: Record<string, number> = {};
          let understoodUtterances = 0;

          data.utterances.forEach((utterance: UtterancesEntity) => {
            // Intent Distribution
            if (utterance.associatedIntentName in intentDistribution) {
              intentDistribution[utterance.associatedIntentName]++;
            } else {
              intentDistribution[utterance.associatedIntentName] = 1;
            }

            // Slot Usage
            if (utterance.associatedSlotName) {
              if (utterance.associatedSlotName in slotUsage) {
                slotUsage[utterance.associatedSlotName]++;
              } else {
                slotUsage[utterance.associatedSlotName] = 1;
              }
            }

            // Response Analysis
            if (utterance.botResponses) {
              utterance.botResponses.forEach((response) => {
                if (response.contentType in responseTypes) {
                  responseTypes[response.contentType]++;
                } else {
                  responseTypes[response.contentType] = 1;
                }
              });
            }

            // Understood Utterances
            if (utterance.utteranceUnderstood) {
              understoodUtterances++;
            }
          });

          // Update the state with the calculated analytics
          state.intentDistribution = intentDistribution;
          state.slotUsage = slotUsage;
          state.responseTypes = responseTypes;
          state.understoodUtterances = understoodUtterances;
        }
      })
      .addCase(fetchUtteranceAnalyticsData.rejected, (state, action) => {
        state.loading = "failed";
        state.error =
          action.error.message || "Error while fetching Utterance metrics";
      });
  },
});

export const { test } = analyticsSlice.actions;

export default analyticsSlice.reducer;
