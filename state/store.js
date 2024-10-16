import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import accountReducer from "./reducers/accountSlice";

const combinedReducer = {
  auth: authSlice,
  account: accountReducer,
};
const middlewares = [];
export const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
  devTools: true,
});
