import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Card from "../components/Card";
import TransactionList from "../components/TransactionList";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

const DashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <ImageBackground
      source={require("../assets/bg.jpg")} // Set your background image here
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <Card />
        <View style={styles.gridContainer}>
          <View style={styles.gridItemContainer}>
            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => navigation.navigate("InitialSendMoney")}
            >
              <Image
                source={require("../assets/icon/send.png")}
                style={styles.iconImage}
              />
            </TouchableOpacity>
            <Text style={styles.gridText}>{t("send")}</Text>
          </View>

          <View style={styles.gridItemContainer}>
            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => navigation.navigate("InitialCashOutScreen")}
            >
              <Image
                source={require("../assets/icon/cash-out.png")}
                style={styles.iconImage}
              />
            </TouchableOpacity>
            <Text style={styles.gridText}>{t("cashOut")}</Text>
          </View>

          <View style={styles.gridItemContainer}>
            <TouchableOpacity style={styles.iconBox}>
              <Image
                source={require("../assets/icon/payment.png")}
                style={styles.iconImage}
              />
            </TouchableOpacity>
            <Text style={styles.gridText}>{t("payment")}</Text>
          </View>

          <View style={styles.gridItemContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddMoneyScreen")}
              style={styles.iconBox}
            >
              <Image
                source={require("../assets/icon/add-money.png")}
                style={styles.iconImage}
              />
            </TouchableOpacity>
            <Text style={styles.gridText}>{t("addMoney")}</Text>
          </View>
        </View>
      </View>
      <View style={styles.scrollableSection}>
        <TransactionList />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomLeftRadius: width * 0.08,
    borderBottomRightRadius: width * 0.08,
    backgroundColor: "transparent",
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    flexWrap: "wrap",
  },
  gridItemContainer: {
    width: width * 0.22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: {
    backgroundColor: "#F1E6FE",
    padding: width * 0.04,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.15,
    height: width * 0.15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconImage: {
    width: width * 0.08,
    height: width * 0.08,
  },
  gridText: {
    color: "#e2136e",
    fontSize: width * 0.035,
    fontWeight: "500",
    marginTop: height * 0.01,
  },
  scrollableSection: {
    flex: 1,
    paddingTop: height * 0.02,
    backgroundColor: "transparent",
  },
});

export default DashboardScreen;
