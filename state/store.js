import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import accountReducer from "./reducers/accountSlice";
import sendMoneyReducer from "./reducers/sendMoneySlice";
import verifyPinReducer from "./reducers/verifyPinSlice";

const combinedReducer = {
  auth: authSlice,
  account: accountReducer,
  sendMoney: sendMoneyReducer,
  verifyPin: verifyPinReducer,
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
