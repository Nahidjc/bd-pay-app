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
const ITEM_HEIGHT = height * 0.1;

const DATA = [
  {
    id: "1",
    title: "Bank to bKash",
    icon: Landmark,
    link: "BankScreen",
    dot: true,
  },
  {
    id: "2",
    title: "Card to bKash",
    icon: CreditCard,
    link: "CardScreen",
    dot: false,
  },
  {
    id: "3",
    title: "Global Wallets",
    icon: Wallet,
    link: "GlobalWalletScreen",
    dot: false,
  },
];

const AddMoneyScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(item.link)}
    >
      <View style={styles.iconContainer}>
        <item.icon color="#E91E63" size={width * 0.075} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {item.dot && <View style={styles.dot} />}
      </View>
      <View style={styles.arrowContainer}>
        <ChevronRight color="#E91E63" size={width * 0.075} />
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
    paddingHorizontal: width * 0.03,
    paddingTop: width * 0.1,
  },
  headerText: {
    fontSize: width * 0.04,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: width * 0.03,
  },
  listContainer: {
    paddingVertical: width * 0.02,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    height: ITEM_HEIGHT * 0.8,
  },
  iconContainer: {
    width: width * 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.04,
    color: "#333",
  },
  dot: {
    width: width * 0.015,
    height: width * 0.015,
    borderRadius: width * 0.0075,
    backgroundColor: "#E91E63",
    marginLeft: width * 0.02,
  },
  arrowContainer: {
    width: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
});

export default AddMoneyScreen;
