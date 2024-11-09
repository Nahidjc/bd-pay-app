import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../state/reducers/transactionsSlice";
import TransactionHistory from "./TransactionHistory";
import TransactionSummary from "./TransactionSummary";

const { width } = Dimensions.get("window");

const StatementScreen = () => {
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState(null);
  const dispatch = useDispatch();
  const { isLoading, transactions } = useSelector(
    (state) => state.transactionsReducer
  );
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTransactions(token));
  }, [dispatch, token]);

  const handleRefresh = () => {
    dispatch(fetchTransactions(token));
  };

  const routes = useMemo(
    () => [
      { key: "history", title: "Transaction History" },
      { key: "summary", title: "Transaction Summary" },
    ],
    []
  );

  const renderScene = useCallback(
    SceneMap({
      history: () => (
        <TransactionHistory
          transactions={transactions}
          filter={filter}
          onFilterPress={setFilter}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      ),
      summary: TransactionSummary,
    }),
    [filter, transactions, isLoading]
  );

  const renderTabBar = useCallback(
    (props) => (
      <TabBar
        {...props}
        indicatorStyle={styles.tabIndicator}
        style={styles.tabBar}
        labelStyle={styles.tabLabel}
        activeColor="#000"
        inactiveColor="#999"
      />
    ),
    []
  );

  return (
    <View style={styles.screenContainer}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={{ width }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#F5F5F5" },
  tabIndicator: { backgroundColor: "red" },
  tabBar: { backgroundColor: "white" },
  tabLabel: { fontSize: width * 0.028 },
});

export default StatementScreen;
