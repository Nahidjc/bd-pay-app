import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import accountReducer from "./reducers/accountSlice";
import sendMoneyReducer from "./reducers/sendMoneySlice";
import verifyPinReducer from "./reducers/verifyPinSlice";
import notificationsReducer from "./reducers/notificationSlice";
import transactionsReducer from "./reducers/transactionsSlice";

const combinedReducer = {
  auth: authSlice,
  account: accountReducer,
  sendMoney: sendMoneyReducer,
  verifyPin: verifyPinReducer,
  notificationsReducer: notificationsReducer,
  transactionsReducer: transactionsReducer,
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
