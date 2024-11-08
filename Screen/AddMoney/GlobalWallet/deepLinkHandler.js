import { Alert } from "react-native";

export const handleDeepLink = (event) => {
  const { url } = event;
  if (url.includes("payment-success")) {
    Alert.alert("Payment Successful", "Your payment was successful.");
    // Update wallet balance or navigate to confirmation screen
  } else if (url.includes("payment-cancel")) {
    Alert.alert("Payment Canceled", "The payment process was canceled.");
  }
};
