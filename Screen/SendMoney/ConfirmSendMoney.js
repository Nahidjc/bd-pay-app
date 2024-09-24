import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
const { width } = Dimensions.get("window");
const baseWidth = 375;
const scale = width / baseWidth;

export default function ConfirmSendMoneyScreen({ route, navigation }) {
  const [amount, setAmount] = useState("");
  const { recipient } = route.params;

  const handleAmountChange = (value) => {
    const numericValue = parseInt(value, 10);
    if (value === "" || (!isNaN(numericValue) && numericValue >= 1)) {
      setAmount(value);
    }
  };
  const isEnglishLetter = (char) => /^[A-Za-z]$/.test(char);
  return (
    <View style={styles.container}>
      <View style={styles.recipientContainer}>
        <View style={styles.avatar}>
          {isEnglishLetter(recipient.name[0]) ? (
            <Avatar
              rounded
              title={recipient.name[0]}
              size={50 * scale}
              containerStyle={{ backgroundColor: "#E1BEE7" }}
            />
          ) : (
            <Ionicons name="person" size={25 * scale} color="white" />
          )}
        </View>
        <View style={styles.recipientInfo}>
          <Text style={styles.recipientName}>{recipient.name}</Text>
          <Text style={styles.recipientNumber}>{recipient.number}</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior="padding" style={styles.amountContainer}>
        <TextInput
          style={styles.amount}
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
          placeholder="5"
          placeholderTextColor="#999"
        />
      </KeyboardAvoidingView>

      <Text style={styles.balanceText}>ব্যবহারযোগ্য ব্যালেন্স: ৳10.15</Text>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          navigation.navigate("SendMoney", {
            recipient,
            amount,
          });
        }}
      >
        <Text style={styles.confirmButtonText}>এগিয়ে যান</Text>
        <Ionicons name="arrow-forward" size={24 * scale} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#E91E63",
    height: 56 * scale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16 * scale,
  },
  backIcon: {
    position: "absolute",
    left: 16 * scale,
    top: "50%",
    transform: [{ translateY: -12 * scale }],
  },
  headerTitle: {
    fontSize: 20 * scale,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  recipientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20 * scale,
    paddingHorizontal: 16 * scale,
  },
  avatar: {
    width: 50 * scale,
    height: 50 * scale,
    borderRadius: 25 * scale,
    backgroundColor: "#E1BEE7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarText: {
    fontSize: 18 * scale,
    color: "#fff",
  },
  recipientInfo: {
    marginLeft: 10 * scale,
  },
  recipientName: {
    fontSize: 16 * scale,
    fontWeight: "bold",
    color: "#333",
  },
  recipientNumber: {
    fontSize: 14 * scale,
    color: "#666",
  },
  amountContainer: {
    alignItems: "center",
    marginTop: 40 * scale,
  },
  amount: {
    fontSize: 40 * scale,
    fontWeight: "bold",
    color: "#E91E63",
  },
  balanceText: {
    textAlign: "center",
    color: "#666",
    marginTop: 10 * scale,
    fontSize: 14 * scale,
  },
  keyboardContainer: {
    marginVertical: 20 * scale,
  },
  amountInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#E91E63",
    fontSize: 32 * scale,
    color: "#333",
    textAlign: "center",
    paddingVertical: 10 * scale,
  },
  confirmButton: {
    backgroundColor: "#E91E63",
    height: 50 * scale,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25 * scale,
    marginVertical: 20 * scale,
  },
  confirmButtonText: {
    fontSize: 18 * scale,
    color: "#fff",
    marginRight: 10 * scale,
  },
});
