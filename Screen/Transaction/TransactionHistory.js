import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { CircleUser } from "lucide-react-native";
import LoadingScreen from "./../../components/Loader/Loader";
import TransactionDetails from "./TransactionDetails";
import { formatNotificationDate } from "../../utilities/helper/useCurrencyFormatter";

const { width } = Dimensions.get("window");

const FilterButtons = React.memo(({ onFilterPress, currentFilter }) => (
  <View style={styles.filterContainer}>
    <Text style={styles.filterLabel}>Filter By</Text>
    <View style={styles.filterButtonGroup}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          styles.filterButtonIn,
          currentFilter === true && styles.filterButtonInActive,
        ]}
        onPress={() => onFilterPress(true)}
      >
        <Text
          style={[
            styles.filterButtonTextIn,
            currentFilter === true && styles.filterButtonTextActive,
          ]}
        >
          + IN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          styles.filterButtonOut,
          currentFilter === false && styles.filterButtonOutActive,
        ]}
        onPress={() => onFilterPress(false)}
      >
        <Text
          style={[
            styles.filterButtonTextOut,
            currentFilter === false && styles.filterButtonTextActive,
          ]}
        >
          - OUT
        </Text>
      </TouchableOpacity>
    </View>
  </View>
));

const TransactionItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(item)}
    style={styles.transactionContainer}
  >
    <CircleUser size={width * 0.1} color="#E1BEE7" style={styles.avatar} />
    <View style={styles.transactionDetails}>
      <Text style={styles.transactionType}>{item.transactionType}</Text>
      <Text style={styles.transactionName}>{item.receiverAccountNumber}</Text>
      <Text style={styles.transactionInfo}>Trans ID: {item.transactionId}</Text>
      <Text style={styles.transactionInfo}>
        {formatNotificationDate(item.transactionDate)}
      </Text>
    </View>
    <View style={styles.transactionAmountContainer}>
      <Text
        style={item.isCredited ? styles.amountPositive : styles.amountNegative}
      >
        ৳{item.amount}
      </Text>
      <Text style={styles.transactionCharge}>Charge ৳{item.charge}</Text>
    </View>
  </TouchableOpacity>
));

const EmptyTransactionMessage = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyMessage}>
      No transactions available. Please try a different filter or check back
      later.
    </Text>
  </View>
);

const TransactionHistory = ({
  transactions,
  filter,
  onFilterPress,
  isLoading,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["60%", "60%"], []);

  const handlePress = useCallback((transaction) => {
    setSelectedTransaction(transaction);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setSelectedTransaction(null);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) =>
        filter === null ? true : transaction.isCredited === filter
      ),
    [transactions, filter]
  );

  return (
    <View style={styles.container}>
      <FilterButtons onFilterPress={onFilterPress} currentFilter={filter} />
      <LoadingScreen visible={isLoading} />
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.transactionId}
        renderItem={({ item }) => (
          <TransactionItem item={item} onPress={handlePress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          filteredTransactions.length === 0 && {
            flex: 1,
            justifyContent: "center",
          },
        ]}
        ListEmptyComponent={EmptyTransactionMessage}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContent}
        >
          {selectedTransaction && (
            <TransactionDetails transaction={selectedTransaction} />
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 2,
    paddingBottom: 20,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  summaryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  filterButtonInActive: {
    backgroundColor: "green",
    borderColor: "green",
  },
  filterButtonOutActive: {
    backgroundColor: "red",
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
  filterButtonTextActive: {
    color: "white",
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
    fontSize: width * 0.035,
    marginBottom: width * 0.005,
  },
  transactionName: {
    color: "#666",
    marginBottom: width * 0.005,
    fontSize: width * 0.028,
  },
  transactionInfo: {
    color: "#999",
    marginBottom: width * 0.005,
    fontSize: width * 0.028,
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
  handleIndicator: {
    backgroundColor: "#ccc",
    width: 40,
  },
  bottomSheetBackground: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bottomSheetContent: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
  },
});

export default TransactionHistory;
