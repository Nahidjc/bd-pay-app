import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privateGet } from "../../utilities/apiCaller";
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (token, { rejectWithValue }) => {
    try {
      const response = await privateGet("/transfer/transactions", token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
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
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.error = null;
        state.errorMessage = "";
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage =
          action.payload?.data?.message || "Failed to fetch transactions";
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
