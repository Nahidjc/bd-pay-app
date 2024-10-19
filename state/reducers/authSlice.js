import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privatePost, publicPost } from "../../utilities/apiCaller";
import { storage, StorageKeys } from "../storage";

const saveAuthState = (isAuthenticated, user, token) => {
  storage.set(StorageKeys.IsAuthenticated, isAuthenticated ? "true" : "false");
  storage.set(StorageKeys.User, JSON.stringify(user));
  storage.set(StorageKeys.Token, token);
};

const loadAuthState = () => {
  const isAuthenticated =
    storage.getString(StorageKeys.IsAuthenticated) === "true";
  const userString = storage.getString(StorageKeys.User);
  const user = userString ? JSON.parse(userString) : {};
  const token = storage.getString(StorageKeys.Token) || null;
  return { isAuthenticated, user, token };
};

const clearAuthState = () => {
  storage.delete(StorageKeys.IsAuthenticated);
  storage.delete(StorageKeys.User);
  storage.delete(StorageKeys.Token);
};

const updateUserInStorage = (updatedUser) => {
  const userString = storage.getString(StorageKeys.User);
  if (userString) {
    const user = JSON.parse(userString);
    const newUser = { ...user, ...updatedUser };
    storage.set(StorageKeys.User, JSON.stringify(newUser));
  }
};

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
      const response = await privatePost("/user/update", token, data);
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
    ...loadAuthState(),
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = {};
      state.token = null;
      state.error = false;
      state.errorMessage = "";
      clearAuthState();
    },
    clearProfileState: (state) => {
      state.isUpdating = false;
      state.updateError = null;
      state.updateSuccess = false;
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.errorMessage = "";
        saveAuthState(true, action.payload.user, action.payload.token);
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
        updateUserInStorage(action.payload.user);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload.data.message;
        state.updateSuccess = false;
      });
  },
});

export const { logout, clearProfileState } = authSlice.actions;
export default authSlice.reducer;
