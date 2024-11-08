import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
const MIN_AMOUNT = 50;

const { width } = Dimensions.get("window");

const OtherAccountTab = () => {
  const [amount, setAmount] = useState("");
  const [isProceedEnabled, setProceedEnabled] = useState(false);

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

    try {
      const response = await createStripeSession(
        parseFloat(amount),
        "otherAccount"
      );
      if (response?.sessionUrl) {
        Linking.openURL(response.sessionUrl);
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
        disabled={!isProceedEnabled}
      >
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f5f5" },
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
  },
  buttonEnabled: { backgroundColor: "#4CAF50" },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default OtherAccountTab;
