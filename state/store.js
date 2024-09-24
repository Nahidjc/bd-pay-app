import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";

const combinedReducer = {
  auth: authSlice,
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
// export const persistor = persistStore(store);
