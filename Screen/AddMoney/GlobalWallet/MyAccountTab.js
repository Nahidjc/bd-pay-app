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
} from "react-native";
import { useSelector } from "react-redux";
import { privatePost } from "../../../utilities/apiCaller";
import WebView from "react-native-webview";

const MIN_AMOUNT = 500;
const CURRENCY = "৳";
const { width, height } = Dimensions.get("window");

const MyAccountTab = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const isProceedEnabled = useMemo(() => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount >= MIN_AMOUNT;
  }, [amount]);

  const handleAmountChange = useCallback((value) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    if (sanitizedValue.split(".").length > 2) return;

    if (
      sanitizedValue.startsWith("0") &&
      sanitizedValue.length > 1 &&
      !sanitizedValue.startsWith("0.")
    ) {
      return;
    }

    setAmount(sanitizedValue);
  }, []);

  const handleAddMoney = useCallback(async () => {
    if (!isProceedEnabled) {
      ToastAndroid.show(
        `Invalid Amount: Please enter an amount of at least ${CURRENCY}${MIN_AMOUNT}.`,
        ToastAndroid.LONG
      );
      return;
    }

    setLoading(true);
    try {
      const response = await privatePost("/transfer/stripe-checkout", token, {
        amount: parseFloat(amount),
      });

      if (response?.data?.checkoutUrl) {
        setCheckoutUrl(response.data.checkoutUrl);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      ToastAndroid.show(
        error.response?.data?.message ||
          "Failed to start payment. Please try again.",
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  }, [amount, isProceedEnabled, token]);

  const handleNavigationStateChange = useCallback((event) => {
    if (event.url.includes("payment-success")) {
      ToastAndroid.show(
        "Payment Successful: Your payment was processed successfully.",
        ToastAndroid.LONG
      );
      setCheckoutUrl(null);
      setAmount("");
    } else if (event.url.includes("payment-cancel")) {
      ToastAndroid.show(
        "Payment Cancelled: The payment process was cancelled.",
        ToastAndroid.LONG
      );
      setCheckoutUrl(null);
    }
  }, []);

  const handleWebViewError = useCallback(() => {
    ToastAndroid.show(
      "Connection Error: Failed to load payment page. Please try again.",
      ToastAndroid.LONG
    );
    setCheckoutUrl(null);
  }, []);

  if (checkoutUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <WebView
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onError={handleWebViewError}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.webViewLoader}>
              <ActivityIndicator size="large" color="#E91E63" />
            </View>
          )}
          style={[styles.webView, { height: height - 100 }]}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.label}>Your BD Pay Account Number</Text>
        <Text style={styles.accountNumber}>01910125428</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter amount (min ${CURRENCY}${MIN_AMOUNT})`}
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
    padding: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  minAmountText: {
    color: "gray",
    fontSize: 12,
    marginTop: 5,
  },
  proceedButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
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
  webView: {
    width: "100%",
  },
  webViewLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});

export default MyAccountTab;
