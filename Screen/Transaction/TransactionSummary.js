import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TransactionSummary = () => (
  <View style={styles.summaryContainer}>
    <Text>Transaction Summary Content</Text>
  </View>
);

const styles = StyleSheet.create({
  summaryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TransactionSummary;
