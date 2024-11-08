import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { privatePost } from "../../../utilities/apiCaller";
import { useSelector } from "react-redux";

const MIN_AMOUNT = 50;
const { width } = Dimensions.get("window");

const OtherAccountTab = () => {
  const [amount, setAmount] = useState("");
  const [isProceedEnabled, setProceedEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { token } = useSelector((state) => state.auth);

  const handleAmountChange = (value) => {
    setAmount(value);
    setProceedEnabled(parseFloat(value) >= MIN_AMOUNT);
  };

  const handleAddMoney = async () => {
    if (!isProceedEnabled) {
      ToastAndroid.show(
        `Please enter an amount of at least ৳${MIN_AMOUNT}.`,
        ToastAndroid.SHORT
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await privatePost("/transfer/payment-sheet", token, {
        amount: parseFloat(amount),
      });

      if (
        !response?.data?.paymentIntent ||
        !response?.data?.ephemeralKey ||
        !response?.data?.customer
      ) {
        ToastAndroid.show("Unable to initialize payment.", ToastAndroid.SHORT);
        setIsLoading(false);
        return;
      }

      const initSheetResponse = await initPaymentSheet({
        paymentIntentClientSecret: response.data.paymentIntent,
        customerEphemeralKeySecret: response.data.ephemeralKey,
        customerId: response.data.customer,
        merchantDisplayName: "Add Money From Stripe Wallet",
      });
      console.log(
        "==============initSheetResponse=============",
        initSheetResponse
      );
      if (initSheetResponse.error) {
        ToastAndroid.show(initSheetResponse.error.message, ToastAndroid.SHORT);
        setIsLoading(false);
        return;
      }

      const presentSheetResponse = await presentPaymentSheet();

      console.log(
        "=============presentSheetResponse===========",
        presentSheetResponse
      );

      if (presentSheetResponse.error) {
        ToastAndroid.show(
          presentSheetResponse.error.message,
          ToastAndroid.SHORT
        );
        setIsLoading(false);
      } else {
        ToastAndroid.show("Your payment was successful!", ToastAndroid.SHORT);
        setAmount("");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      ToastAndroid.show(
        "Failed to start payment. Please try again.",
        ToastAndroid.SHORT
      );
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Name or Number</Text>
      <TextInput style={styles.input} placeholder="Enter name or number" />
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={handleAmountChange}
      />
      <Text style={styles.minAmountText}>Min. amount ৳{MIN_AMOUNT}.00</Text>
      <TouchableOpacity
        style={[
          styles.proceedButton,
          isProceedEnabled ? styles.buttonEnabled : styles.buttonDisabled,
        ]}
        onPress={handleAddMoney}
        disabled={!isProceedEnabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Proceed</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    height: "100%",
  },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  minAmountText: { color: "gray", marginBottom: 20 },
  proceedButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    width: "100%",
  },
  buttonEnabled: { backgroundColor: "#E91E63" },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default OtherAccountTab;
