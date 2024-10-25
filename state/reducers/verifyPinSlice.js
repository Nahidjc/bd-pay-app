import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privatePost } from "../../utilities/apiCaller";

export const verifyPin = createAsyncThunk(
  "user/verifyPin",
  async ({ token, pin }, { rejectWithValue }) => {
    try {
      const response = await privatePost("/user/pin-verify", token, { pin });
      return response;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

const verifyPinSlice = createSlice({
  name: "verifyPin",
  initialState: {
    isPinCorrect: null,
    isLoading: false,
    error: null,
    errorMessage: "",
  },
  reducers: {
    clearPinStatus: (state) => {
      state.isPinCorrect = null;
      state.error = null;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyPin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isPinCorrect = action.payload?.data?.isPinCorrect;
        state.error = null;
      })
      .addCase(verifyPin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = action.payload?.message || "Failed to verify PIN";
      });
  },
});

export const { clearPinStatus } = verifyPinSlice.actions;
export default verifyPinSlice.reducer;
