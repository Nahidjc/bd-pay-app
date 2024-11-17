import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../state/reducers/transactionsSlice";
import { formatNotificationDate } from "../utilities/helper/useCurrencyFormatter";
import { CircleUserRound } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const TransactionList = () => {
  const dispatch = useDispatch();
  const { isLoading, transactions } = useSelector(
    (state) => state.transactionsReducer
  );
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTransactions(token));
  }, [dispatch, token]);
  const renderTransaction = useCallback(
    ({ item }) => (
      <View style={styles.transactionItem}>
        <CircleUserRound color="#E91E63" size={width * 0.1} />
        <View style={styles.details}>
          <Text style={styles.transactionDescription}>
            {item.transactionType}
          </Text>
          <Text style={styles.transactionDate}>
            {formatNotificationDate(item.transactionDate)}
          </Text>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            { color: item.isCredited ? "#4CAF50" : "#E91E63" },
          ]}
        >
          ৳{item.amount}
        </Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={transactions.slice(0, 3)}
            renderItem={renderTransaction}
            keyExtractor={(item) => item._id.toString()}
            ListEmptyComponent={() => (
              <Text style={styles.emptyMessage}>No transactions available</Text>
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    </View>
  );
};
export default React.memo(TransactionList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.02,
  },
  loader: {
    marginTop: height * 0.1,
  },
  listContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: height * 0.01,
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
  emptyMessage: {
    fontSize: width * 0.04,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: height * 0.02,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.015,
  },
  details: {
    flex: 1,
    marginLeft: width * 0.03,
  },
  transactionDescription: {
    fontSize: width * 0.037,
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
