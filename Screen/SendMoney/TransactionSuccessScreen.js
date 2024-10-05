import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const TransactionSuccessScreen = () => {
  const route = useRoute();
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{message}</Text>
        <Image
          source={require("../../assets/check-icon.png")}
          style={styles.checkIcon}
        />
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0]}</Text>
        </View>
        <View style={styles.namePhone}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.phone}>{phoneNumber}</Text>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callButtonText}>কল</Text>
        </TouchableOpacity>
      </View>

      {/* Details Section with Precise Borders */}
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <View style={[styles.cell, styles.rightBorder]}>
            <Text style={styles.detailLabel}>সময়</Text>
            <Text style={styles.detailValue}>{`${time} ${date}`}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.detailLabel}>ট্রানজেকশন আইডি</Text>
            <Text style={styles.detailValue}>{transactionId}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.cell, styles.rightBorder]}>
            <Text style={styles.detailLabel}>সর্বমোট</Text>
            <Text style={styles.detailValue}>৳{amount}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.detailLabel}>নতুন ব্যালেন্স</Text>
            <View style={styles.valueWithIcon}>
              <Text style={styles.detailValue}>৳{newBalance}</Text>
              <Image
                source={require("../../assets/icon/show.png")}
                style={styles.eyeIcon}
              />
            </View>
          </View>
        </View>

        <View style={[styles.row, styles.lastRow]}>
          <View style={styles.fullWidthCell}>
            <Text style={styles.detailLabel}>রেফারেন্স</Text>
            <Text style={styles.detailValue}>{reference}</Text>
          </View>
        </View>
      </View>

      {/* Auto Pay Button */}
      <TouchableOpacity style={styles.autoPay} onPress={onAutoPayPress}>
        <Text style={styles.autoPayText}>অটো পে চালু করুন</Text>
      </TouchableOpacity>

      {/* Home Button */}
      <TouchableOpacity style={styles.homeButton} onPress={onHomePress}>
        <Text style={styles.homeButtonText}>হোম-এ ফিরে যাই</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for better spacing, borders, and row/column setup
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  headerText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#027e02",
  },
  checkIcon: {
    width: width * 0.08,
    height: width * 0.08,
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
    backgroundColor: "#e91e63",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  namePhone: {
    marginLeft: width * 0.03,
    flex: 1,
  },
  name: {
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  phone: {
    fontSize: width * 0.035,
    color: "#666",
  },
  callButton: {
    backgroundColor: "#fff",
    borderColor: "#e91e63",
    borderWidth: 1,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.02,
  },
  callButtonText: {
    color: "#e91e63",
    fontSize: width * 0.035,
  },

  // Details Section
  detailsContainer: {
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: height * 0.03,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  cell: {
    flex: 0.5,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  fullWidthCell: {
    flex: 1,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
  },
  detailLabel: {
    fontSize: width * 0.035,
    color: "#666",
  },
  detailValue: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    marginTop: height * 0.005,
  },
  valueWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    width: width * 0.04,
    height: width * 0.04,
    marginLeft: width * 0.02,
  },

  autoPay: {
    backgroundColor: "#fff",
    borderColor: "#e91e63",
    borderWidth: 1,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    marginBottom: height * 0.02,
  },
  autoPayText: {
    textAlign: "center",
    color: "#e91e63",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  homeButton: {
    backgroundColor: "#e91e63",
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
  },
  homeButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});

export default TransactionSuccessScreen;
