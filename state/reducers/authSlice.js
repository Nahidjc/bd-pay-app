import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privatePostFile, publicPost } from "../../utilities/apiCaller";

export const createUserLogin = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await publicPost("/user/login", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

export const createUserRegistration = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await publicPost("/user/registration", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/update",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await privatePostFile("/user/update", token, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    isLoading: false,
    user: {},
    token: null,
    error: false,
    errorMessage: "",
    isUpdating: false,
    updateError: null,
    updateSuccess: false,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = {};
      state.token = null;
      state.error = false;
      state.errorMessage = "";
    },
    clearProfileState: (state) => {
      state.isUpdating = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    setBiometricUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserLogin.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(createUserLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.errorMessage = "";
      })
      .addCase(createUserLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = action.payload.data.message;
      });

    builder
      .addCase(createUserRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(createUserRegistration.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = "";
      })
      .addCase(createUserRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = action.payload.data.message;
      });

    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateError = null;
        state.updateSuccess = true;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload.data.message;
        state.updateSuccess = false;
      });
  },
});

export const { logout, clearProfileState, setBiometricUser } =
  authSlice.actions;
export default authSlice.reducer;
