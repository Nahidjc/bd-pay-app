import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { privatePost } from "../../../utilities/apiCaller";
import { useSelector } from "react-redux";

const MIN_AMOUNT = 500;
const CURRENCY = "৳";
const { width, height } = Dimensions.get("window");

const MyAccountTab = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { token, user } = useSelector((state) => state.auth);

  const isProceedEnabled = useMemo(() => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount >= MIN_AMOUNT;
  }, [amount]);

  const handleAmountChange = useCallback((value) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    if (sanitizedValue.split(".").length > 2) return;
    setAmount(sanitizedValue);
  }, []);

  const handleAddMoney = async () => {
    if (!isProceedEnabled) {
      ToastAndroid.show(
        `Invalid Amount: Please enter an amount of at least ${CURRENCY}${MIN_AMOUNT}.`,
        ToastAndroid.LONG
      );
      return;
    }

    setLoading(true);
    try {
      const response = await privatePost("/transfer/payment-sheet", token, {
        amount: parseFloat(formData.amount),
        receiverAccountNumber: user.accountNumber,
        accountType: "OWN_ACCOUNT",
      });

      if (
        !response?.data?.paymentIntent ||
        !response?.data?.ephemeralKey ||
        !response?.data?.customer
      ) {
        throw new Error("Invalid payment initialization response");
      }

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: response.data.paymentIntent,
        customerEphemeralKeySecret: response.data.ephemeralKey,
        customerId: response.data.customer,
        merchantDisplayName: "Add Money From Stripe Wallet",
      });

      if (initError) {
        throw new Error(initError.message);
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        throw new Error(presentError.message);
      }

      ToastAndroid.show("Your payment was successful!", ToastAndroid.SHORT);
      setAmount("");
    } catch (error) {
      console.error("Payment error:", error);
      ToastAndroid.show(
        error.message || "Payment failed. Please try again.",
        ToastAndroid.SHORT
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={loading} />}
      >
        <Text style={styles.label}>Your BD Pay Account Number</Text>
        <Text style={styles.accountNumber}>{user.accountNumber}</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter Add Money Amount`}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={handleAmountChange}
            editable={!loading}
          />
          <Text style={styles.minAmountText}>
            Min. amount {CURRENCY}
            {MIN_AMOUNT}.00
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.proceedButton,
            isProceedEnabled ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          onPress={handleAddMoney}
          disabled={!isProceedEnabled || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Proceed</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: width * 0.05,
    alignItems: "center",
  },
  label: {
    fontSize: width * 0.03,
    fontWeight: "600",
    marginBottom: height * 0.01,
    color: "#333",
  },
  accountNumber: {
    fontSize: width * 0.04,
    fontWeight: "700",
    marginBottom: height * 0.02,
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: height * 0.02,
  },
  input: {
    width: "100%",
    height: height * 0.06,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    fontSize: width * 0.04,
    color: "#333",
    backgroundColor: "#fff",
  },
  minAmountText: {
    color: "gray",
    fontSize: width * 0.035,
    marginTop: height * 0.005,
  },
  proceedButton: {
    width: "100%",
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width * 0.02,
    marginTop: height * 0.015,
  },
  buttonEnabled: {
    backgroundColor: "#E91E63",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});

export default MyAccountTab;
