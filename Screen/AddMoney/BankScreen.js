import React, { useState, useMemo } from "react";
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

import ABBankLogo from "../../assets/banks/ab-bank.svg";
import EBLLogo from "../../assets/banks/ebl.svg";
import DBBLLogo from "../../assets/banks/dbbl.svg";
import CityBankLogo from "../../assets/banks/city-bank.svg";
import DhakaBankLogo from "../../assets/banks/dhaka-bank.svg";
import IFICBankLogo from "../../assets/banks/ific-bank.svg";
import MTBLogo from "../../assets/banks/mtb.svg";

const { width, height } = Dimensions.get("window");

const BANK_DATA = [
  { id: "1", name: "Eastern Bank PLC", logo: EBLLogo, isLinked: false },
  { id: "2", name: "AB Bank PLC", logo: ABBankLogo, isLinked: true },
  {
    id: "3",
    name: "Dutch Bangla Bank PLC",
    logo: DBBLLogo,
    isLinked: true,
  },
  { id: "4", name: "City Bank PLC", logo: CityBankLogo, isLinked: true },
  { id: "5", name: "DHAKA BANK PLC", logo: DhakaBankLogo, isLinked: false },
  { id: "6", name: "IFIC Bank PLC", logo: IFICBankLogo, isLinked: true },
  { id: "8", name: "Mutual Trust Bank PLC", logo: MTBLogo, isLinked: true },
];

const BankScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBanks = useMemo(
    () =>
      BANK_DATA.filter((bank) =>
        bank.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const renderBankItem = ({ item }) => (
    <TouchableOpacity style={styles.bankItem}>
      <View style={styles.bankInfo}>
        <item.logo width={width * 0.12} height={width * 0.12} />
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
        <Text style={styles.searchTitle}>Enter Bank name to search</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Bank Name"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          <ChevronRight size={width * 0.06} color="#666" />
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>All Banks</Text>
        <FlatList
          data={filteredBanks}
          keyExtractor={(item) => item.id}
          renderItem={renderBankItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No banks found.</Text>
          }
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
    padding: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchTitle: {
    fontSize: width * 0.045,
    fontWeight: "500",
    color: "#333",
    marginBottom: width * 0.03,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: width * 0.04,
    height: height * 0.06,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#333",
    paddingRight: width * 0.02,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: width * 0.02,
  },
  listTitle: {
    fontSize: width * 0.045,
    fontWeight: "500",
    color: "#666",
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  bankItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: width * 0.04,
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
    flex: 1,
    marginLeft: width * 0.03,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  dot: {
    position: "absolute",
    top: -width * 0.02,
    right: width * 0.04,
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
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: width * 0.04,
    padding: width * 0.05,
  },
});

export default BankScreen;
