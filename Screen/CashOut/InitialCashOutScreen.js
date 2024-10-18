import React, { memo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Home, Search, QrCode, CreditCard } from "lucide-react-native";

const TabBar = memo(({ activeTab, onTabChange }) => (
  <View style={styles.tabBarContainer}>
    <TouchableOpacity
      style={[styles.tab, activeTab === "agent" && styles.activeTab]}
      onPress={() => onTabChange("agent")}
    >
      <Home size={20} color={activeTab === "agent" ? "#E91E63" : "#9E9E9E"} />
      <Text
        style={[
          styles.tabText,
          activeTab === "agent" ? styles.activeTabText : styles.inactiveTabText,
        ]}
      >
        Agent
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.tab, activeTab === "atm" && styles.activeTab]}
      onPress={() => onTabChange("atm")}
    >
      <CreditCard
        size={20}
        color={activeTab === "atm" ? "#E91E63" : "#9E9E9E"}
      />
      <Text
        style={[
          styles.tabText,
          activeTab === "atm" ? styles.activeTabText : styles.inactiveTabText,
        ]}
      >
        ATM
      </Text>
    </TouchableOpacity>
  </View>
));

const SearchBar = memo(() => (
  <View style={styles.searchContainer}>
    <Search color="#9E9E9E" size={20} />
    <TextInput
      style={styles.searchInput}
      placeholder="Enter Agent number or name"
      placeholderTextColor="#9E9E9E"
    />
  </View>
));

const InitialCashOutScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("agent");

  return (
    <SafeAreaView style={styles.container}>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <SearchBar />
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate("ScanQrCodeScreen")}
      >
        <QrCode color="#E91E63" size={24} />
        <Text style={styles.scanButtonText}>Tap To Scan QR Code</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E91E63",
    height: 56,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
  },
  rightIcon: {
    width: 40,
  },
  tabBarContainer: {
    flexDirection: "row",
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#E91E63",
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#E91E63",
  },
  inactiveTabText: {
    color: "#9E9E9E",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#212121",
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E91E63",
    borderRadius: 8,
  },
  scanButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#E91E63",
    fontWeight: "500",
  },
});

export default memo(InitialCashOutScreen);
