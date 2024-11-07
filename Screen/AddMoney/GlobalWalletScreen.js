import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ChevronRight, Link } from "lucide-react-native";
import PaypalLogo from "../../assets/svgs/paypal.svg";
import StripeLogo from "../../assets/svgs/stripe.svg";
import ApexLogo from "../../assets/svgs/apex.svg";

const { width, height } = Dimensions.get("window");

const BANK_DATA = [
  { id: "1", name: "PayPal", logo: PaypalLogo, isLinked: false },
  { id: "2", name: "Stripe", logo: StripeLogo, isLinked: true },
  { id: "3", name: "Apex", logo: ApexLogo, isLinked: false },
];

const GlobalWalletScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBanks = BANK_DATA.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBankItem = ({ item }) => (
    <TouchableOpacity style={styles.bankItem}>
      <View style={styles.bankInfo}>
        <item.logo width={width * 0.1} height={width * 0.1} />
        <Text style={styles.bankName}>{item.name}</Text>
      </View>
      <View style={styles.linkContainer}>
        {item.isLinked && <View style={styles.dot} />}
        <Link size={width * 0.06} color="#e2136e" />
        <ChevronRight
          width={width * 0.06}
          height={width * 0.06}
          color="#e2136e"
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>Enter Wallet name to search</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Wallet Name"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          <ChevronRight
            width={width * 0.05}
            height={width * 0.05}
            color="#666"
          />
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>All Global Wallets</Text>
        <FlatList
          data={filteredBanks}
          keyExtractor={(item) => item.id}
          renderItem={renderBankItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchTitle: {
    fontSize: width * 0.035,
    fontWeight: "500",
    color: "#333",
    marginBottom: width * 0.02,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: width * 0.04,
    height: height * 0.055,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.035,
    color: "#333",
    paddingRight: width * 0.02,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: width * 0.02,
  },
  listTitle: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#666",
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  bankItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.025,
    backgroundColor: "#fff",
  },
  bankInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bankName: {
    fontSize: width * 0.04,
    color: "#333",
    marginLeft: width * 0.05,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  dot: {
    position: "absolute",
    top: -width * 0.03,
    right: width * 0.06,
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: "#e2136e",
  },
  chevron: {
    marginLeft: width * 0.02,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
});

export default GlobalWalletScreen;
