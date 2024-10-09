import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { publicPost } from "../../utilities/apiCaller";
import { storage, StorageKeys } from "../storage";

const saveAuthState = (isAuthenticated, user) => {
  storage.set(StorageKeys.IsAuthenticated, isAuthenticated ? "true" : "false");
  storage.set(StorageKeys.User, JSON.stringify(user));
};

const loadAuthState = () => {
  const isAuthenticated =
    storage.getString(StorageKeys.IsAuthenticated) === "true";
  const userString = storage.getString(StorageKeys.User);
  const user = userString ? JSON.parse(userString) : {};
  return { isAuthenticated, user };
};

const clearAuthState = () => {
  storage.delete(StorageKeys.IsAuthenticated);
  storage.delete(StorageKeys.User);
};

export const createUserLogin = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await publicPost("/auth/login", data);
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
      const response = await publicPost("/auth/register", data);
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
    error: false,
    errorMessage: "",
    updatedStudent: false,
    ...loadAuthState(),
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = {};
      state.error = false;
      state.errorMessage = "";
      clearAuthState();
    },
    errorClean: (state) => {
      state.error = false;
      state.errorMessage = "";
      state.updatedStudent = false;
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
        state.error = null;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.errorMessage = "";
        state.token = action.payload.token;
        saveAuthState(true, action.payload);
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
      .addCase(createUserRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.errorMessage = "";
        saveAuthState(true, action.payload);
      })
      .addCase(createUserRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = action.payload.data.message;
      });
  },
});

export const { logout, errorClean } = authSlice.actions;
export default authSlice.reducer;
