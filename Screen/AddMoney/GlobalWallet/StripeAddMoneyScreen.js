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
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { ChevronRight } from "lucide-react-native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const StripeAddMoneyScreen = () => {
  const [amount, setAmount] = useState("");
  const [isProceedEnabled, setProceedEnabled] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "myAccount", title: "My Account" },
    { key: "otherAccount", title: "Other Account" },
  ]);

  const handleAmountChange = (value) => {
    setAmount(value);
    setProceedEnabled(parseFloat(value) >= 50);
  };

  const handleAddMoney = async () => {
    try {
      if (!isProceedEnabled) {
        Alert.alert(
          "Invalid amount",
          "Please enter an amount of at least ৳50."
        );
        return;
      }

      // Call backend to create a Stripe checkout session
      const response = await axios.post(
        "https://your-backend-url.com/create-checkout-session",
        { amount: parseFloat(amount) }
      );

      const { sessionUrl } = response.data;

      if (sessionUrl) {
        window.open(sessionUrl, "_blank");
      } else {
        Alert.alert("Error", "Unable to initiate payment.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      Alert.alert("Error", "Failed to start payment. Please try again.");
    }
  };

  const MyAccountTab = () => (
    <View style={[styles.tabContent, styles.myAccountTab]}>
      <Text style={styles.label}>Your bKash Account Number</Text>
      <Text style={styles.accountNumber}>01910125428</Text>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={[styles.input, styles.amountInput]}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={handleAmountChange}
      />
      <Text style={styles.minAmountText}>Min. amount ৳50.00</Text>
      <TouchableOpacity
        style={[
          styles.proceedButton,
          isProceedEnabled ? styles.buttonEnabled : styles.buttonDisabled,
        ]}
        onPress={handleAddMoney}
        disabled={!isProceedEnabled}
      >
        <Text style={styles.buttonText}>Proceed</Text>
        <ChevronRight color="#E91E63" size={width * 0.06} />
      </TouchableOpacity>
    </View>
  );

  const OtherAccountTab = () => (
    <View style={[styles.tabContent, styles.otherAccountTab]}>
      <Text style={styles.label}>Select Name or Number</Text>
      <TextInput
        style={[styles.input, styles.nameInput]}
        placeholder="Enter name or number"
      />
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={[styles.input, styles.amountInput]}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={handleAmountChange}
      />
      <Text style={styles.minAmountText}>Min. amount ৳50.00</Text>
      <TouchableOpacity
        style={[
          styles.proceedButton,
          isProceedEnabled ? styles.buttonEnabled : styles.buttonDisabled,
        ]}
        onPress={handleAddMoney}
        disabled={!isProceedEnabled}
      >
        <Text style={styles.buttonText}>Proceed</Text>
        <ChevronRight color="#E91E63" size={width * 0.06} />
      </TouchableOpacity>
    </View>
  );

  const renderScene = SceneMap({
    myAccount: MyAccountTab,
    otherAccount: OtherAccountTab,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={styles.tabIndicator}
          style={styles.tabBar}
          renderLabel={({ route, focused }) => (
            <Text
              style={[styles.tabLabel, focused ? styles.tabLabelActive : null]}
            >
              {route.title}
            </Text>
          )}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 20,
  },
  myAccountTab: {
    backgroundColor: "#fff",
  },
  otherAccountTab: {
    backgroundColor: "#f5f5f5",
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
    marginBottom: 10,
  },
  nameInput: {
    marginBottom: 15,
  },
  amountInput: {
    marginBottom: 5,
  },
  minAmountText: {
    color: "gray",
    marginBottom: 20,
  },
  proceedButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 15,
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
  tabBar: {
    backgroundColor: "#f5f5f5",
  },
  tabIndicator: {
    backgroundColor: "#E91E63",
  },
  tabLabel: {
    color: "#000",
    margin: 8,
  },
  tabLabelActive: {
    color: "#E91E63",
  },
});

export default StripeAddMoneyScreen;
