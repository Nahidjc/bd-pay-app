import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { privatePost } from "../../../utilities/apiCaller";
import { useSelector } from "react-redux";

const MIN_AMOUNT = 50;
const ACCOUNT_NUMBER_LENGTH = 11;

const OtherAccountTab = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    amount: "",
  });
  const [errors, setErrors] = useState({
    accountNumber: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { token } = useSelector((state) => state.auth);

  const validateAccountNumber = useCallback((number) => {
    if (!number) return "Account number is required";
    if (!/^\d+$/.test(number)) return "Account number must contain only digits";
    if (number.length !== ACCOUNT_NUMBER_LENGTH)
      return `Account number must be ${ACCOUNT_NUMBER_LENGTH} digits`;
    return "";
  }, []);

  const validateAmount = useCallback((value) => {
    if (!value) return "Amount is required";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Please enter a valid amount";
    if (numValue < MIN_AMOUNT) return `Minimum amount is ৳${MIN_AMOUNT}`;
    return "";
  }, []);

  const isProceedEnabled = useMemo(() => {
    const isAccountValid =
      formData.accountNumber.length === ACCOUNT_NUMBER_LENGTH &&
      /^\d+$/.test(formData.accountNumber);
    const isAmountValid = parseFloat(formData.amount) >= MIN_AMOUNT;
    return isAccountValid && isAmountValid;
  }, [formData]);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      let validationError = "";
      if (field === "accountNumber") {
        validationError = validateAccountNumber(value);
      } else if (field === "amount") {
        validationError = validateAmount(value);
      }

      setErrors((prev) => ({ ...prev, [field]: validationError }));
    },
    [validateAccountNumber, validateAmount]
  );

  const handleAddMoney = async () => {
    if (!isProceedEnabled) {
      ToastAndroid.show("Please check all fields", ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);

    try {
      const response = await privatePost("/transfer/payment-sheet", token, {
        amount: parseFloat(formData.amount),
        receiverAccountNumber: formData.accountNumber,
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
      setFormData({ accountNumber: "", amount: "" });
    } catch (error) {
      console.error("Payment error:", error);
      ToastAndroid.show(
        error.message || "Payment failed. Please try again.",
        ToastAndroid.SHORT
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Receiver Account Number</Text>
      <TextInput
        style={[styles.input, errors.accountNumber && styles.inputError]}
        placeholder="Enter 11-digit account number"
        keyboardType="numeric"
        maxLength={ACCOUNT_NUMBER_LENGTH}
        value={formData.accountNumber}
        onChangeText={(value) => handleInputChange("accountNumber", value)}
      />
      {errors.accountNumber && (
        <Text style={styles.errorText}>{errors.accountNumber}</Text>
      )}

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={[styles.input, errors.amount && styles.inputError]}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={formData.amount}
        onChangeText={(value) => handleInputChange("amount", value)}
      />
      {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  inputError: {
    borderColor: "#ff0000",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginBottom: 10,
  },
  minAmountText: {
    color: "gray",
    marginBottom: 20,
  },
  proceedButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    width: "100%",
  },
  buttonEnabled: {
    backgroundColor: "#E91E63",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OtherAccountTab;
