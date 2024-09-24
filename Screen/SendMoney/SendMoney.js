import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import SendMoneyModal from "./SendMoneyModal";
import { LoadingScreen } from "../../components/Loader/Loader";

const { width } = Dimensions.get("window");
const baseWidth = 375;
const scale = width / baseWidth;

export default function SendMoney({ route, navigation }) {
  const { recipient, amount } = route.params;
  const [pin, setPin] = useState("");
  const [reference, setReference] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const maxChars = 50;
  const pinLength = 4;
  const maxReferenceChars = 50;

  useEffect(() => {
    fetchCurrentBalance();
  }, []);

  useEffect(() => {
    let interval;
    if (isPressed && progress < 1) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 0.1;
          if (newProgress >= 1) {
            clearInterval(interval);
            handleSendMoney();
          }
          return Math.min(newProgress, 1);
        });
      }, 20);
    } else if (!isPressed) {
      clearInterval(interval);
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPressed, progress]);

  const fetchCurrentBalance = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ balance: 25000 }), 1000)
      );
      setCurrentBalance(response.balance);
      setError(null);
    } catch (err) {
      setError("Failed to fetch current balance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = useCallback(
    (text) => {
      setPin(text.slice(0, pinLength));
    },
    [pinLength]
  );

  const handleReferenceChange = useCallback(
    (text) => {
      setReference(text.slice(0, maxReferenceChars));
    },
    [maxReferenceChars]
  );

  const toggleModal = () => {
    setModalVisible(false);
  };

  const validateInputs = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return false;
    }
    if (parseFloat(amount) > currentBalance) {
      Alert.alert(
        "Insufficient Balance",
        "You do not have enough balance for this transaction."
      );
      return false;
    }
    if (pin.length !== pinLength) {
      Alert.alert("Invalid PIN", "Please enter a valid 4-digit PIN.");
      return false;
    }
    return true;
  }, [amount, currentBalance, pin, pinLength]);

  const handleSendMoney = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentBalance((prevBalance) => prevBalance - parseFloat(amount));
      setModalVisible(false);
      navigation.navigate("TransactionSuccess", {
        amount: parseFloat(amount),
        recipient: recipient,
      });
    } catch (err) {
      Alert.alert(
        "Transaction Failed",
        "Unable to complete the transaction. Please try again."
      );
    } finally {
      setIsLoading(false);
      setProgress(0);
      setIsPressed(false);
    }
  }, [amount, recipient, navigation]);

  const handlePressIn = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
  }, []);
  if (isLoading) {
    return <LoadingScreen />;
  }
  const isEnglishLetter = (char) => /^[A-Za-z]$/.test(char);
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchCurrentBalance}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <SendMoneyModal
        visible={isModalVisible}
        onClose={toggleModal}
        recipientName={recipient.name}
        recipientPhone={recipient.number}
        amount={parseFloat(amount)}
        charge={0}
        newBalance={currentBalance - parseFloat(amount)}
        reference={reference}
        progress={progress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      />
      <View style={styles.recipientCard}>
        <Text style={styles.toText}>প্রাপক</Text>
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
      </View>
      <View style={styles.amountSection}>
        <View style={styles.amountRow}>
          <View style={styles.amountCol}>
            <Text style={styles.label}>পরিমাণ</Text>
            <Text style={styles.value}>{`৳ ${amount}`}</Text>
          </View>
          <View style={styles.amountCol}>
            <Text style={styles.label}>চার্জ</Text>
            <Text style={styles.value}>+৳ 0.00</Text>
          </View>
          <View style={styles.amountCol}>
            <Text style={styles.label}>সর্বমোট</Text>
            <Text style={styles.value}>{`৳ ${amount}`}</Text>
          </View>
        </View>
        <View style={styles.referenceRow}>
          <Text style={styles.referenceLabel}>রেফারেন্স</Text>
          <Text style={styles.referenceLimit}>
            {reference.length}/{maxChars}
          </Text>
        </View>
        <TextInput
          style={styles.referenceInput}
          placeholder="নোট লিখতে ট্যাপ করুন"
          placeholderTextColor="#999"
          value={reference}
          onChangeText={handleReferenceChange}
          maxLength={maxChars} // Ensure the max characters are respected
        />
      </View>

      <View style={styles.pinSection}>
        <View style={styles.pinInputContainer}>
          <Ionicons
            name="lock-closed"
            size={18 * scale}
            color="#E91E63"
            style={styles.lockIcon}
          />
          <TextInput
            style={styles.pinInput}
            placeholder="পিন নম্বর দিন"
            placeholderTextColor="#999"
            value={pin}
            keyboardType="number-pad"
            secureTextEntry={true}
            maxLength={pinLength}
            onChangeText={handlePinChange}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          pin.length === pinLength ? styles.activeConfirmButton : {},
        ]}
        disabled={pin.length !== pinLength}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.confirmButtonText}>পিন কনফার্ম করুন</Text>
        <Ionicons name="arrow-forward" size={24 * scale} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16 * scale,
    backgroundColor: "#fff",
  },
  recipientCard: {
    backgroundColor: "#fff",
    padding: 16 * scale,
    borderRadius: 10 * scale,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20 * scale,
    elevation: 1,
  },
  toText: {
    fontSize: 14 * scale,
    color: "#999",
    marginBottom: 10 * scale,
  },
  recipientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5 * scale,
  },
  avatar: {
    width: 40 * scale,
    height: 40 * scale,
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
  amountSection: {
    backgroundColor: "#fff",
    padding: 16 * scale,
    borderRadius: 10 * scale,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20 * scale,
    elevation: 1,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20 * scale,
  },
  amountCol: {
    alignItems: "center",
  },
  label: {
    fontSize: 14 * scale,
    color: "#666",
    marginBottom: 5 * scale,
  },
  value: {
    fontSize: 16 * scale,
    fontWeight: "bold",
    color: "#333",
  },
  referenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  referenceLabel: {
    fontSize: 14 * scale,
    color: "#666",
  },
  referenceLimit: {
    fontSize: 14 * scale,
    color: "#666",
  },
  referenceInput: {
    marginTop: 10 * scale,
    fontSize: 14 * scale,
    paddingVertical: 5 * scale,
    color: "#333",
    borderWidth: 0,
  },
  pinSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20 * scale,
  },
  pinInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10 * scale,
    paddingVertical: 12 * scale,
    paddingHorizontal: 10 * scale,
    backgroundColor: "#f8f8f8",
  },
  lockIcon: {
    marginRight: 10 * scale,
  },
  pinInput: {
    flex: 1,
    fontSize: 16 * scale,
    textAlign: "center",
    color: "#333",
  },
  confirmButton: {
    flexDirection: "row",
    backgroundColor: "#ccc",
    padding: 16 * scale,
    borderRadius: 25 * scale,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20 * scale,
  },
  activeConfirmButton: {
    backgroundColor: "#E91E63",
  },
  confirmButtonText: {
    fontSize: 16 * scale,
    color: "#fff",
    marginRight: 10 * scale,
  },
});
