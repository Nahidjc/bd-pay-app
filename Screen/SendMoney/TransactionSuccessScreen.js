import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ToastAndroid,
  Clipboard,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
const { width, height } = Dimensions.get("window");

const scale = {
  base: width * 0.04,
  small: width * 0.035,
  xsmall: width * 0.03,
  large: width * 0.05,
  icon: width * 0.05,
  spacing: width * 0.04,
  radius: width * 0.02,
};

const TransactionSuccessScreen = () => {
  const route = useRoute();
  const { t } = useTranslation();
  const {
    message,
    name,
    phoneNumber,
    time,
    date,
    transactionId,
    amount,
    newBalance,
    reference,
    onAutoPayPress,
    onHomePress,
  } = route.params;
  const [showBalance, setShowBalance] = useState(false);

  const copyTransactionId = () => {
    Clipboard.setString(transactionId);
    ToastAndroid.show("Transaction ID copied to clipboard", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{message}</Text>
        <View style={styles.checkIconContainer}>
          <Image
            source={require("../../assets/check-icon.png")}
            style={styles.checkIcon}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0]}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userPhone}>{phoneNumber}</Text>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.detailsRow}>
          <View style={[styles.detailsColumn, styles.borderRight]}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{`${time} ${date}`}</Text>
          </View>
          <View style={styles.detailsColumn}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <View style={styles.rowWithIcon}>
              <Text style={styles.detailValue}>{transactionId}</Text>
              <TouchableOpacity onPress={copyTransactionId}>
                <Image
                  source={require("../../assets/icon/copy.png")}
                  style={styles.copyIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.detailsRow}>
          <View style={[styles.detailsColumn, styles.borderRight]}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={styles.amountValue}>৳ {amount}</Text>
          </View>
          <View style={styles.detailsColumn}>
            <Text style={styles.detailLabel}>New Balance</Text>
            <View style={styles.rowWithIcon}>
              <Text style={styles.amountValue}>
                ৳ {showBalance ? newBalance : "•••••"}
              </Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                <Image
                  source={
                    showBalance
                      ? require("../../assets/icon/hide.png")
                      : require("../../assets/icon/show.png")
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[styles.detailsRow, styles.noBorder]}>
          <View style={styles.fullWidthColumn}>
            <Text style={styles.detailLabel}>Reference</Text>
            <Text style={styles.detailValue}>{reference}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.autoPayButton} onPress={onAutoPayPress}>
        <Text style={styles.autoPayText}>{t("auto_pay")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={onHomePress}>
        <Text style={styles.homeButtonText}>{t("home_button")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: scale.spacing,
    paddingTop: height * 0.05,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: height * 0.03,
  },
  headerText: {
    fontSize: scale.base,
    fontWeight: "bold",
    color: "#27AE60",
  },
  checkIconContainer: {
    width: width * 0.1,
    height: width * 0.1,
    backgroundColor: "#E8F5E9",
    borderRadius: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  checkIcon: {
    width: width * 0.1,
    height: width * 0.1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: scale.large,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
    marginLeft: scale.spacing,
  },
  userName: {
    fontSize: scale.base,
    fontWeight: "bold",
    color: "#333",
  },
  userPhone: {
    fontSize: scale.small,
    color: "#666",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale.spacing,
    paddingVertical: scale.spacing * 0.5,
    borderRadius: scale.radius,
    borderWidth: 1,
    borderColor: "#E91E63",
  },
  phoneIcon: {
    width: scale.icon,
    height: scale.icon,
    marginRight: scale.spacing * 0.5,
  },
  callButtonText: {
    color: "#E91E63",
    fontSize: scale.small,
  },
  detailsCard: {
    borderRadius: scale.radius,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: height * 0.03,
  },
  detailsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  detailsColumn: {
    flex: 1,
    padding: scale.spacing,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  fullWidthColumn: {
    padding: scale.spacing,
  },
  detailLabel: {
    fontSize: scale.small,
    color: "#666",
    marginBottom: scale.spacing * 0.25,
  },
  detailValue: {
    fontSize: scale.small,
    fontWeight: "bold",
    color: "#333",
  },
  amountValue: {
    fontSize: scale.small,
    fontWeight: "bold",
    color: "#333",
  },
  rowWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  copyIcon: {
    width: scale.icon,
    height: scale.icon,
    marginLeft: scale.spacing,
  },
  eyeIcon: {
    width: scale.icon,
    height: scale.icon,
    marginLeft: scale.spacing,
  },
  autoPayButton: {
    paddingVertical: height * 0.02,
    borderRadius: scale.radius,
    borderWidth: 1,
    borderColor: "#E91E63",
    marginBottom: height * 0.02,
  },
  autoPayText: {
    textAlign: "center",
    color: "#E91E63",
    fontSize: scale.base,
    fontWeight: "bold",
  },
  homeButton: {
    backgroundColor: "#E91E63",
    paddingVertical: height * 0.02,
    borderRadius: scale.radius,
  },
  homeButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: scale.base,
    fontWeight: "bold",
  },
});

export default TransactionSuccessScreen;
