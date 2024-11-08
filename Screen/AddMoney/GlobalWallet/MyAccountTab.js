import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import { useSelector } from "react-redux";
import { privatePost } from "../../../utilities/apiCaller";
// import { createStripeSession } from "../services/api";
// import { MIN_AMOUNT } from "../utils/constants";
const MIN_AMOUNT = 50;
const { width } = Dimensions.get("window");

const MyAccountTab = () => {
  const [amount, setAmount] = useState("");
  const [isProceedEnabled, setProceedEnabled] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const handleAmountChange = (value) => {
    setAmount(value);
    setProceedEnabled(parseFloat(value) >= MIN_AMOUNT);
  };

  const handleAddMoney = async () => {
    if (!isProceedEnabled) {
      Alert.alert(
        "Invalid amount",
        `Please enter an amount of at least ৳${MIN_AMOUNT}.`
      );
      return;
    }
    console.log("============starting==================");
    try {
      const response = await privatePost("/transfer/stripe-checkout", token, {
        amount: parseFloat(amount),
      });
      console.log(response);
      if (response?.data?.checkoutUrl) {
        Linking.openURL(response.data.checkoutUrl);
      } else {
        Alert.alert("Error", "Unable to initiate payment.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      Alert.alert("Error", "Failed to start payment. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your BD Pay Account Number</Text>
      <Text style={styles.accountNumber}>01910125428</Text>
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
        disabled={!isProceedEnabled}
      >
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  accountNumber: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
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
  },
  buttonEnabled: { backgroundColor: "#E91E63" },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default MyAccountTab;
