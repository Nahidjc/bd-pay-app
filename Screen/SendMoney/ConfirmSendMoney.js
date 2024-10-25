import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const baseWidth = 375;
const scale = width / baseWidth;

export default function ConfirmSendMoneyScreen({ route, navigation }) {
  const [amount, setAmount] = useState(0);
  const buttonOpacity = new Animated.Value(1);
  const { t } = useTranslation();
  const { recipient, availableBalance } = route.params || {};

  const handleAmountChange = (value) => {
    const numericValue = parseInt(value, 10);
    if (value === "" || (!isNaN(numericValue) && numericValue >= 0)) {
      setAmount(value);
      Animated.timing(buttonOpacity, {
        toValue: value ? 1 : 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  const isEnglishLetter = (char) => /^[A-Za-z]$/.test(char);
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recipient</Text>
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

      <Text style={styles.amountTitle}>Amount</Text>

      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>৳</Text>
        <TextInput
          style={styles.amount}
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#999"
        />
      </View>

      <Text style={styles.balanceText}>
        Available Balance: ৳ {availableBalance}
      </Text>

      <TouchableOpacity
        style={[styles.confirmButton, !amount && styles.buttonDisabled]}
        onPress={() => {
          if (amount) {
            navigation.navigate("SendMoney", {
              recipient,
              amount,
              availableBalance
            });
          }
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmButtonText}>{t("proceed")}</Text>
        <Ionicons name="arrow-forward" size={24 * scale} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15 * scale,
  },
  sectionTitle: {
    fontSize: 18 * scale,
    color: "#666",
    marginTop: 20 * scale,
    marginBottom: 15 * scale,
  },
  recipientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30 * scale,
  },
  avatar: {
    width: 56 * scale,
    height: 56 * scale,
    borderRadius: 28 * scale,
    backgroundColor: "#E1BEE7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarText: {
    fontSize: 24 * scale,
    color: "#fff",
    fontWeight: "600",
  },
  recipientInfo: {
    marginLeft: 15 * scale,
  },
  recipientName: {
    fontSize: 18 * scale,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4 * scale,
  },
  recipientNumber: {
    fontSize: 16 * scale,
    color: "#666",
  },
  amountTitle: {
    fontSize: 18 * scale,
    color: "#666",
    marginBottom: 15 * scale,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10 * scale,
  },
  currencySymbol: {
    fontSize: 40 * scale,
    color: "#E91E63",
    marginRight: 8 * scale,
  },
  amount: {
    fontSize: 40 * scale,
    color: "#E91E63",
    fontWeight: "500",
    minWidth: 120 * scale,
    textAlign: "left",
    padding: 0,
  },
  balanceText: {
    fontSize: 16 * scale,
    color: "#666",
    textAlign: "center",
    marginBottom: 30 * scale,
  },
  confirmButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E91E63",
    borderTopLeftRadius: 12 * scale,
    borderTopRightRadius: 12 * scale,
    height: 54 * scale,
    paddingHorizontal: 24 * scale,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
    shadowOpacity: 0.15,
    elevation: 2,
  },
  confirmButtonText: {
    fontSize: 18 * scale,
    color: "#fff",
    fontWeight: "500",
  },
});
