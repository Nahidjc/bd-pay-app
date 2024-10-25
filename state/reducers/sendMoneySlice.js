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

const sendMoneySlice = createSlice({
  name: "sendMoney",
  initialState: {
    sendMoneyStatus: null,
    isLoading: false,
    error: null,
    errorMessage: "",
  },
  reducers: {
    clearSendMoneyStatus: (state) => {
      state.sendMoneyStatus = null;
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
      });
  },
});

export const { clearSendMoneyStatus } = sendMoneySlice.actions;
export default sendMoneySlice.reducer;
