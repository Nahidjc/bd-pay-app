import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import SendMoneyModal from "./SendMoneyModal";
import { verifyPin } from "../../state/reducers/verifyPinSlice";
import LoadingScreen from "../../components/Loader/Loader";
import { transferSendMoney } from "../../state/reducers/sendMoneySlice";

const { width } = Dimensions.get("window");
const baseWidth = 375;
const scale = width / baseWidth;

const CONSTANTS = {
  PIN_LENGTH: 4,
  MAX_REFERENCE_CHARS: 50,
  PROGRESS_INTERVAL: 20,
  PROGRESS_INCREMENT: 0.1,
};

const isEnglishLetter = (char) => /^[A-Za-z]$/.test(char);

const formatCurrency = (amount) => {
  return `৳ ${parseFloat(amount).toFixed(2)}`;
};

const generateTransactionId = () =>
  `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

const formatDateTime = (date = new Date()) => {
  return {
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    date: date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }),
  };
};

export default function SendMoney({ route, navigation }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { isLoading } = useSelector((state) => state.verifyPin);
  const { token } = useSelector((state) => state.auth);
  const { recipient, amount, availableBalance } = route.params;

  const [pin, setPin] = useState("");
  const [reference, setReference] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  // Memoized calculations
  const totalAmount = useMemo(() => parseFloat(amount), [amount]);
  const newBalance = useMemo(
    () => availableBalance - totalAmount,
    [availableBalance, totalAmount]
  );

  const avatarContent = useMemo(() => {
    if (recipient?.name?.[0] && isEnglishLetter(recipient.name[0])) {
      return (
        <Avatar
          rounded
          title={recipient.name[0].toUpperCase()}
          size={50 * scale}
          containerStyle={styles.avatarContainer}
        />
      );
    }
    return <Ionicons name="person" size={25 * scale} color="white" />;
  }, [recipient?.name]);

  useEffect(() => {
    let interval;

    if (isPressed && progress < 1) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + CONSTANTS.PROGRESS_INCREMENT;

          if (newProgress >= 1) {
            clearInterval(interval);
            requestAnimationFrame(() => handleSendMoney());
          }

          return Math.min(newProgress, 1);
        });
      }, CONSTANTS.PROGRESS_INTERVAL);
    } else if (!isPressed) {
      clearInterval(interval);
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPressed, progress]);

  const handlePinChange = useCallback((text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setPin(numericText.slice(0, CONSTANTS.PIN_LENGTH));
  }, []);

  const handleReferenceChange = useCallback((text) => {
    setReference(text.slice(0, CONSTANTS.MAX_REFERENCE_CHARS));
  }, []);

  const toggleModal = useCallback(() => {
    setModalVisible((prev) => !prev);
  }, []);

  const handlePressIn = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleNavigateToHome = useCallback(() => {
    navigation.navigate("Dashboard");
  }, [navigation]);

  const handleAutoPayPress = useCallback(() => {
    console.log("Auto Pay Pressed");
  }, []);

  const showErrorMessage = useCallback((message, description) => {
    showMessage({
      message,
      description,
      type: "danger",
      backgroundColor: "#e2136e",
      duration: 3000,
    });
  }, []);

  const handleSendMoney = async () => {
    setModalVisible(false);

    try {
      const response = await dispatch(verifyPin({ token, pin })).unwrap();
      if (!response?.data?.isPinCorrect) {
        showErrorMessage(
          "PIN Verification Failed",
          "Please check your PIN and try again."
        );
        return;
      }

      const sendMoneyResponse = await dispatch(
        sendMoney({
          token,
          receiverAccountNumber: recipient.number,
          amount: totalAmount,
          referenceText: reference,
        })
      ).unwrap();

      if (sendMoneyResponse?.data?.transaction) {
        const { transaction, senderAccount } = sendMoneyResponse.data;

        const { time, date } = formatDateTime(transaction.transactionDate);
        const transactionId = transaction.transactionId;
        navigation.navigate("TransactionSuccess", {
          message: t("send_money_success"),
          name: recipient.name,
          phoneNumber: recipient.number,
          time,
          date,
          transactionId,
          amount: transaction.amount,
          newBalance: senderAccount.balance,
          reference: transaction.referenceText,
          onAutoPayPress: handleAutoPayPress,
          onHomePress: handleNavigateToHome,
        });
      } else {
        showErrorMessage(
          "Transaction Failed",
          sendMoneyResponse?.message ||
            "Failed to send money. Please try again."
        );
      }
    } catch (error) {
      showErrorMessage(
        "Transaction Failed",
        "An error occurred during the transaction. Please try again later."
      );
    } finally {
      setProgress(0);
      setIsPressed(false);
    }
  };

  const isPinComplete = pin.length === CONSTANTS.PIN_LENGTH;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <LoadingScreen visible={isLoading} />

        <SendMoneyModal
          visible={isModalVisible}
          onClose={toggleModal}
          recipientName={recipient.name}
          recipientPhone={recipient.number}
          amount={totalAmount}
          charge={0}
          newBalance={newBalance}
          reference={reference}
          progress={progress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />

        <View style={styles.content}>
          <View style={styles.recipientCard}>
            <Text style={styles.toText}>{t("recipient")}</Text>
            <View style={styles.recipientContainer}>
              <View style={styles.avatar}>{avatarContent}</View>
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientName}>{recipient.name}</Text>
                <Text style={styles.recipientNumber}>{recipient.number}</Text>
              </View>
            </View>
          </View>

          <View style={styles.amountSection}>
            <View style={styles.amountRow}>
              <View style={styles.amountCol}>
                <Text style={styles.label}>{t("amount_label")}</Text>
                <Text style={styles.value}>{formatCurrency(amount)}</Text>
              </View>
              <View style={styles.amountCol}>
                <Text style={styles.label}>{t("charge")}</Text>
                <Text style={styles.value}>৳ 0.00</Text>
              </View>
              <View style={styles.amountCol}>
                <Text style={styles.label}>{t("total")}</Text>
                <Text style={styles.value}>{formatCurrency(amount)}</Text>
              </View>
            </View>

            <View style={styles.referenceRow}>
              <Text style={styles.referenceLabel}>{t("reference")}</Text>
              <Text style={styles.referenceLimit}>
                {reference.length}/{CONSTANTS.MAX_REFERENCE_CHARS}
              </Text>
            </View>

            <TextInput
              style={styles.referenceInput}
              placeholder={t("note_placeholder")}
              placeholderTextColor="#999"
              value={reference}
              onChangeText={handleReferenceChange}
              maxLength={CONSTANTS.MAX_REFERENCE_CHARS}
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
                placeholder={t("pin_placeholder")}
                placeholderTextColor="#999"
                value={pin}
                keyboardType="numeric"
                secureTextEntry={true}
                maxLength={CONSTANTS.PIN_LENGTH}
                onChangeText={handlePinChange}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              isPinComplete && styles.activeConfirmButton,
            ]}
            disabled={!isPinComplete}
            onPress={toggleModal}
          >
            <Text style={styles.confirmButtonText}>{t("confirm_pin")}</Text>
            <Ionicons name="arrow-forward" size={24 * scale} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

SendMoney.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      recipient: PropTypes.shape({
        name: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
      }).isRequired,
      amount: PropTypes.string.isRequired,
      availableBalance: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16 * scale,
  },
  recipientCard: {
    backgroundColor: "#fff",
    padding: 16 * scale,
    borderRadius: 10 * scale,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20 * scale,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  avatarContainer: {
    backgroundColor: "#E1BEE7",
  },
  recipientInfo: {
    marginLeft: 10 * scale,
    flex: 1,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    alignItems: "center",
  },
  referenceLabel: {
    fontSize: 14 * scale,
    color: "#666",
  },
  referenceLimit: {
    fontSize: 12 * scale,
    color: "#999",
  },
  referenceInput: {
    marginTop: 10 * scale,
    fontSize: 14 * scale,
    paddingVertical: 8 * scale,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pinSection: {
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
    marginRight: 10,
    color: "#ff3e6c",
    fontSize: 24,
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
    fontWeight: "600",
  },
});
