import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

const transactions = [
  {
    id: "1",
    description: "Paypal Receive",
    date: "04/11/21",
    amount: "+$100.00",
    icon: require("../assets/images/paypal.png"),
  },
  {
    id: "2",
    description: "Gopay Top-Up",
    date: "04/11/21",
    amount: "-$50.00",
    icon: require("../assets/images/paypal.png"),
  },
  {
    id: "3",
    description: "Send To Alexis",
    date: "03/11/21",
    amount: "-$250.00",
    icon: require("../assets/images/paypal.png"),
  },
];

const TransactionList = () => {
  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Image source={item.icon} style={styles.icon} />
      <View style={styles.details}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.amount.startsWith("+") ? "#4CAF50" : "#F44336" },
        ]}
      >
        {item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Recent Activity</Text>
        <Text style={styles.headerFilter}>All</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => {
            return <Text style={styles.sectionHeader}>Today</Text>;
          }}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: width * 0.04,
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
  },
  headerFilter: {
    fontSize: width * 0.035,
    color: "#8E8E93",
  },
  listContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
  },
  listContent: {
    paddingHorizontal: width * 0.04,
  },
  sectionHeader: {
    fontSize: width * 0.035,
    color: "#8E8E93",
    marginVertical: height * 0.01,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.015,
  },
  icon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
  },
  details: {
    flex: 1,
    marginLeft: width * 0.03,
  },
  transactionDescription: {
    fontSize: width * 0.04,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: width * 0.035,
    color: "#8E8E93",
    marginTop: height * 0.005,
  },
  transactionAmount: {
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});

export default TransactionList;
