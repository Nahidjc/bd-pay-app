import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Landmark,
  CreditCard,
  Wallet,
  ChevronRight,
} from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const DATA = [
  {
    id: "1",
    title: "Bank to bKash",
    icon: Landmark,
    link: "BankScreen",
  },
  {
    id: "2",
    title: "Card to bKash",
    icon: CreditCard,
    link: "CardScreen",
  },
  {
    id: "3",
    title: "Global Wallets",
    icon: Wallet,
    link: "GlobalWalletScreen",
  },
];

const AddMoneyScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(item.link)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <item.icon color="#E91E63" size={width * 0.075} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.arrowContainer}>
        <ChevronRight color="#E91E63" size={width * 0.06} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select your Add Money source</Text>
      <View style={styles.divider} />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.001,
    paddingTop: width * 0.05,
  },
  headerText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: width * 0.03,
  },
  listContainer: {
    paddingVertical: width * 0.009,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.03,
    borderRadius: width * 0.02,
    backgroundColor: "#f9f9f9",
    marginVertical: width * 0.015,
  },
  iconContainer: {
    width: width * 0.15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: width * 0.045,
    color: "#333",
    fontWeight: "500",
  },
  arrowContainer: {
    width: width * 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
});

export default AddMoneyScreen;
