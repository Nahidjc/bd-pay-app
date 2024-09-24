import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");

const transactions = [
  {
    id: "1",
    type: "Mobile Recharge",
    name: "Gp",
    transId: "BIE9L0QOJ3",
    date: "07:11pm 14/09/24",
    amount: "120.00",
    charge: "0.00",
    isCredited: false,
  },
  {
    id: "2",
    type: "Send Money",
    name: "Hamim",
    transId: "BIB0I8OO88",
    date: "06:44pm 11/09/24",
    amount: "2,700.00",
    charge: "0.00",
    isCredited: false,
  },
  {
    id: "3",
    type: "Bank to bKash",
    name: "DHAKA BANK LIMITED",
    transId: "BIB7I8LTTR",
    date: "06:43pm 11/09/24",
    ref: "Self purpose",
    amount: "500.00",
    charge: "0.00",
    isCredited: true,
  },
  {
    id: "4",
    type: "Payment",
    name: "Utilities",
    transId: "BIK9J8UU2O",
    date: "03:25pm 10/09/24",
    amount: "1,550.00",
    charge: "0.00",
    isCredited: false,
  },
  {
    id: "5",
    type: "Add Money",
    name: "From Bank",
    transId: "BIX1H8ZZ99",
    date: "12:00pm 09/09/24",
    amount: "2,000.00",
    charge: "0.00",
    isCredited: true,
  },
  {
    id: "6",
    type: "Pay Bill",
    name: "Internet",
    transId: "BIR4F8LL4P",
    date: "10:47am 07/09/24",
    amount: "850.00",
    charge: "0.00",
    isCredited: false,
  },
  {
    id: "7",
    type: "Donation",
    name: "Charity",
    transId: "BIM2J8SSQ1",
    date: "05:30pm 05/09/24",
    amount: "300.00",
    charge: "0.00",
    isCredited: false,
  },
  {
    id: "8",
    type: "Cash Out",
    name: "ATM Withdrawal",
    transId: "BIJ8O8LLK2",
    date: "02:15pm 04/09/24",
    amount: "5,000.00",
    charge: "10.00",
    isCredited: false,
  },
  {
    id: "9",
    type: "Loan",
    name: "Loan Disbursement",
    transId: "BIP6Y8PPJ7",
    date: "11:00am 02/09/24",
    amount: "10,000.00",
    charge: "0.00",
    isCredited: true,
  },
  {
    id: "10",
    type: "Remittance",
    name: "Overseas Income",
    transId: "BIL3F8HHN3",
    date: "09:16am 01/09/24",
    amount: "15,000.00",
    charge: "0.00",
    isCredited: true,
  },
  {
    id: "11",
    type: "Education Fee",
    name: "School Fees",
    transId: "BIG1Q8ZZX4",
    date: "08:30am 31/08/24",
    amount: "3,200.00",
    charge: "0.00",
    isCredited: false,
  },
];

const FilterButtons = ({ onFilterPress }) => (
  <View style={styles.filterContainer}>
    <Text style={styles.filterLabel}>Filter By</Text>
    <View style={styles.filterButtonGroup}>
      <TouchableOpacity
        style={[styles.filterButton, styles.filterButtonIn]}
        onPress={() => onFilterPress(true)}
      >
        <Text style={styles.filterButtonTextIn}>+ IN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, styles.filterButtonOut]}
        onPress={() => onFilterPress(false)}
      >
        <Text style={styles.filterButtonTextOut}>- OUT</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Transaction Item Component
const TransactionItem = ({ item }) => (
  <View style={styles.transactionContainer}>
    <Ionicons
      name="person-circle-outline"
      size={40}
      color="#E1BEE7"
      style={styles.avatar}
    />
    <View style={styles.transactionDetails}>
      <Text style={styles.transactionType}>{item.type}</Text>
      <Text style={styles.transactionName}>{item.name}</Text>
      <Text style={styles.transactionInfo}>Trans ID: {item.transId}</Text>
      <Text style={styles.transactionInfo}>{item.date}</Text>
    </View>
    <View style={styles.transactionAmountContainer}>
      <Text
        style={item.isCredited ? styles.amountPositive : styles.amountNegative}
      >
        ৳{item.amount}
      </Text>
      <Text style={styles.transactionCharge}>Charge ৳{item.charge}</Text>
    </View>
  </View>
);

// Main Component
const StatementScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "history", title: "Transaction History" },
    { key: "summary", title: "Transaction Summary" },
  ]);
  const [filter, setFilter] = useState(null);
  const filteredTransactions = transactions.filter((transaction) =>
    filter === null ? true : transaction.isCredited === filter
  );
  const renderScene = SceneMap({
    history: () => (
      <View style={{ flex: 1 }}>
        <FilterButtons onFilterPress={setFilter} />
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem item={item} />}
        />
      </View>
    ),
    summary: () => (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Transaction Summary Content</Text>
      </View>
    ),
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#000"
      inactiveColor="#999"
    />
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.paperContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
        />
      </View>
    </View>
  );
};

// Styles
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
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 15,
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  filterButtonGroup: {
    flexDirection: "row",
  },
  filterButton: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginLeft: 10,
  },
  filterButtonIn: {
    borderColor: "green",
  },
  filterButtonOut: {
    borderColor: "red",
  },
  filterButtonTextIn: {
    color: "green",
    fontWeight: "bold",
    fontSize: 14,
  },
  filterButtonTextOut: {
    color: "red",
    fontWeight: "bold",
    fontSize: 14,
  },
  transactionContainer: {
    flexDirection: "row",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  avatar: {
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
  transactionName: {
    color: "#666",
    fontSize: width * 0.03,
  },
  transactionInfo: {
    color: "#999",
    fontSize: width * 0.03,
  },
  transactionAmountContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  amountPositive: {
    color: "green",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  amountNegative: {
    color: "red",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  transactionCharge: {
    color: "#999",
    fontSize: width * 0.034,
  },
  tabIndicator: {
    backgroundColor: "red",
  },
  tabBar: {
    backgroundColor: "white",
  },
  tabLabel: {
    fontSize: width * 0.028,
  },
});

export default StatementScreen;
