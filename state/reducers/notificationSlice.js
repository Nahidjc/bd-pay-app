import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privateGet } from "../../utilities/apiCaller";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (token, { rejectWithValue }) => {
    try {
      const response = await privateGet("/notification/fetch", token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
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
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.error = null;
        state.errorMessage = "";
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage =
          action.payload?.data?.message || "Failed to fetch notifications";
      });
  },
});

export const { clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
