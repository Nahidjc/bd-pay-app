import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { showMessage, hideMessage } from "react-native-flash-message";
import BkashSVG from "../../assets/svgs/bkash.svg";

const { width, height } = Dimensions.get("window");

export default function RegistrationScreen() {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const validateForm = () => {
    if (accountNumber.length !== 13) {
      return "Account Number must be 13 digits";
    }
    if (pin.length !== 4) {
      return "PIN must be 4 digits";
    }
    if (confirmPin !== pin) {
      return "PINs do not match";
    }
    return "";
  };

  const handleRegister = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      showMessage({
        message: error,
        backgroundColor: "#e2136e",
        type: "default",
        color: "white",
      });
    } else {
      console.log("Registration successful");
      setError("");
      setShowError(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BkashSVG width={width} height={height * 0.15} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Account Number (13 digits)"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
            maxLength={13}
          />
          <TextInput
            style={styles.input}
            placeholder="Create TPin (4 digits)"
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm TPin (4 digits)"
            value={confirmPin}
            onChangeText={setConfirmPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#666",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
    padding: 10,
  },
  errorText: {
    color: "white",
    textAlign: "center",
  },
});
