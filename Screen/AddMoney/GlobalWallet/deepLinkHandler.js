import { ToastAndroid } from "react-native";

export const handleDeepLink = (event) => {
  const { url } = event;
  if (url.includes("payment-success")) {
    ToastAndroid.show(
      "Payment Successful: Your payment was successful.",
      ToastAndroid.LONG
    );
  } else if (url.includes("payment-cancel")) {
    ToastAndroid.show(
      "Payment Canceled: The payment process was canceled.",
      ToastAndroid.LONG
    );
  }
};
