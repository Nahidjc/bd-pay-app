import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const dailyData = [
  {
    title: "Cash In from Agent",
    count: "0",
    amount: "৳0.00",
    limitCount: "10 times",
    limitAmount: "৳50,000.00",
  },
  {
    title: "Add Money from Bank and Card",
    count: "0",
    amount: "৳0.00",
    limitCount: "20 times",
    limitAmount: "৳50,000.00",
  },
  {
    title: "Send Money",
    count: "0",
    amount: "৳0.00",
    limitCount: "50 times",
    limitAmount: "৳50,000.00",
  },
  {
    title: "bKash to Bank",
    count: "0",
    amount: "৳0.00",
    limitCount: "10 times",
    limitAmount: "৳50,000.00",
  },
  {
    title: "Mobile Recharge",
    count: "0",
    amount: "৳0.00",
    limitCount: "Not applicable",
    limitAmount: "৳50,000.00",
  },
  {
    title: "Payment",
    count: "0",
    amount: "৳0.00",
    limitCount: "15 times",
    limitAmount: "৳30,000.00",
  },
  {
    title: "Cashout",
    count: "0",
    amount: "৳0.00",
    limitCount: "5 times",
    limitAmount: "৳20,000.00",
  },
  {
    title: "Pay Bill",
    count: "0",
    amount: "৳0.00",
    limitCount: "Not applicable",
    limitAmount: "৳40,000.00",
  },
  {
    title: "Insurance",
    count: "0",
    amount: "৳0.00",
    limitCount: "3 times",
    limitAmount: "৳10,000.00",
  },
  {
    title: "Credit Card Bill Pay",
    count: "0",
    amount: "৳0.00",
    limitCount: "5 times",
    limitAmount: "৳50,000.00",
  },
  {
    title: "Remittance",
    count: "0",
    amount: "৳0.00",
    limitCount: "10 times",
    limitAmount: "৳100,000.00",
  },
];

const monthlyData = [
  {
    title: "Cash In from Agent",
    count: "0",
    amount: "৳0.00",
    limitCount: "30 times",
    limitAmount: "৳150,000.00",
  },
  {
    title: "Add Money from Bank and Card",
    count: "0",
    amount: "৳0.00",
    limitCount: "60 times",
    limitAmount: "৳150,000.00",
  },
  {
    title: "Send Money",
    count: "0",
    amount: "৳0.00",
    limitCount: "100 times",
    limitAmount: "৳200,000.00",
  },
  {
    title: "bKash to Bank",
    count: "0",
    amount: "৳0.00",
    limitCount: "20 times",
    limitAmount: "৳100,000.00",
  },
  {
    title: "Mobile Recharge",
    count: "0",
    amount: "৳0.00",
    limitCount: "Not applicable",
    limitAmount: "৳150,000.00",
  },
  {
    title: "Payment",
    count: "0",
    amount: "৳0.00",
    limitCount: "60 times",
    limitAmount: "৳120,000.00",
  },
  {
    title: "Cashout",
    count: "0",
    amount: "৳0.00",
    limitCount: "20 times",
    limitAmount: "৳50,000.00",
  },
  {
    title: "Pay Bill",
    count: "0",
    amount: "৳0.00",
    limitCount: "Not applicable",
    limitAmount: "৳200,000.00",
  },
  {
    title: "Insurance",
    count: "0",
    amount: "৳0.00",
    limitCount: "10 times",
    limitAmount: "৳50,000.00",
  },
  {
    title: "Credit Card Bill Pay",
    count: "0",
    amount: "৳0.00",
    limitCount: "10 times",
    limitAmount: "৳100,000.00",
  },
  {
    title: "Remittance",
    count: "0",
    amount: "৳0.00",
    limitCount: "30 times",
    limitAmount: "৳300,000.00",
  },
];

export const TransactionLimitScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Daily");
  const data = selectedTab === "Daily" ? dailyData : monthlyData;

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.cellService}>
        <Text style={styles.serviceText}>{item.title}</Text>
      </View>

      <View style={styles.cellContent}>
        <Text style={styles.countText}>{item.count}</Text>
        <View style={styles.separatorLine} />
        <Text style={styles.limitText}>{item.limitCount}</Text>
      </View>

      <View style={styles.cellContent}>
        <Text style={styles.amountText}>{item.amount}</Text>
        <View style={styles.separatorLine} />
        <Text style={styles.limitText}>{item.limitAmount}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.paperContainer}>
        <View style={styles.tabHeader}>
          <TouchableOpacity
            onPress={() => setSelectedTab("Daily")}
            style={styles.tabButton}
          >
            <View style={styles.activeTabContainer}>
              <Text
                style={
                  selectedTab === "Daily"
                    ? styles.activeTab
                    : styles.inactiveTab
                }
              >
                Daily Limit
              </Text>
              {selectedTab === "Daily" && (
                <View style={styles.activeUnderline} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab("Monthly")}
            style={styles.tabButton}
          >
            <View style={styles.inactiveTabContainer}>
              <Text
                style={
                  selectedTab === "Monthly"
                    ? styles.activeTab
                    : styles.inactiveTab
                }
              >
                Monthly Limit
              </Text>
              {selectedTab === "Monthly" && (
                <View style={styles.activeUnderline} />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.tableHeader}>
          <Text style={styles.headerTitle}>Service</Text>
          <Text style={styles.headerTitle}>Count</Text>
          <Text style={styles.headerTitle}>Amount</Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: width * 0.04,
  },
  paperContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: height * 0.02,
  },
  activeTabContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.01,
  },
  inactiveTabContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.01,
  },
  activeTab: {
    color: "#D81B60",
    fontSize: width * 0.04,
  },
  inactiveTab: {
    color: "#888",
    fontSize: width * 0.04,
  },
  activeUnderline: {
    width: "150%",
    height: 2,
    backgroundColor: "#D81B60",
    marginTop: 3,
    alignSelf: "center",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    flex: 3,
    fontSize: width * 0.04,
    color: "#000",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cellService: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  cellContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  separatorLine: {
    width: "60%",
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  serviceText: {
    fontSize: 12,
    color: "#333",
  },
  countText: {
    fontSize: 16,
    color: "#d81b60", // Customize your count color
  },
  amountText: {
    fontSize: 16,
    color: "#d81b60",
  },
  limitText: {
    fontSize: 12,
    color: "#757575",
  },
});
