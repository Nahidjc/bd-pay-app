import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privatePost } from "../../utilities/apiCaller";

export const checkSendMoney = createAsyncThunk(
  "sendMoney/checkSendMoney",
  async ({ token, accountNumber }, { rejectWithValue }) => {
    try {
      const response = await privatePost("/account/check-send-money", token, {
        receiverAccountNumber: accountNumber,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

export const transferSendMoney = createAsyncThunk(
  "sendMoney/sendMoney",
  async (
    { token, receiverAccountNumber, amount, referenceText },
    { rejectWithValue }
  ) => {
    try {
      const response = await privatePost("/transfer/send-money", token, {
        receiverAccountNumber,
        amount,
        referenceText,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

const sendMoneySlice = createSlice({
  name: "transferSendMoney",
  initialState: {
    sendMoneyStatus: null,
    sendMoneyResponse: null,
    isLoading: false,
    error: null,
    errorMessage: "",
  },
  reducers: {
    clearSendMoneyStatus: (state) => {
      state.sendMoneyStatus = null;
      state.sendMoneyResponse = null;
      state.error = null;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSendMoney.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkSendMoney.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sendMoneyStatus = action.payload;
        state.error = null;
      })
      .addCase(checkSendMoney.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage =
          action.payload?.data?.message ||
          "Failed to validate send money request";
      })
      .addCase(transferSendMoney.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(transferSendMoney.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sendMoneyResponse = action.payload;
        state.error = null;
      })
      .addCase(transferSendMoney.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage =
          action.payload?.data?.message || "Failed to send money";
      });
  },
});

export const { clearSendMoneyStatus } = sendMoneySlice.actions;
export default sendMoneySlice.reducer;
