import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privateGet, publicGet } from "../../utilities/apiCaller";

export const fetchAccountBalance = createAsyncThunk(
  "account/fetchBalance",
  async (token, { rejectWithValue }) => {
    try {
      const response = await privateGet("/account/balance", token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState: {
    balance: 0,
    isLoading: false,
    error: null,
    errorMessage: "",
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.error = null;
        state.errorMessage = "";
      })
      .addCase(fetchAccountBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage =
          action.payload?.data?.message || "Failed to fetch balance";
      });
  },
});

export const { clearError } = accountSlice.actions;
export default accountSlice.reducer;
