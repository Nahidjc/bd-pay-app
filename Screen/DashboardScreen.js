import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Card from "../components/Card";
import TransactionList from "../components/TransactionList";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
const { width, height } = Dimensions.get("window");

const DashboardScreen = () => {
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#CBF2FD", "#F4FAFB"]} style={styles.header}>
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
            <View style={styles.iconBox}>
              <Image
                source={require("../assets/icon/cash-out.png")}
                style={styles.iconImage}
              />
            </View>
            <Text style={styles.gridText}>{t("cashOut")}</Text>
          </View>

          <View style={styles.gridItemContainer}>
            <View style={styles.iconBox}>
              <Image
                source={require("../assets/icon/payment.png")}
                style={styles.iconImage}
              />
            </View>
            <Text style={styles.gridText}>{t("payment")}</Text>
          </View>

          <View style={styles.gridItemContainer}>
            <View style={styles.iconBox}>
              <Image
                source={require("../assets/icon/add-money.png")}
                style={styles.iconImage}
              />
            </View>
            <Text style={styles.gridText}>{t("addMoney")}</Text>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.scrollableSection}>
        <TransactionList />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: height * 0.3,
    paddingBottom: height * 0.04,
    borderBottomLeftRadius: width * 0.08,
    borderBottomRightRadius: width * 0.08,
  },
  greeting: {
    color: "black",
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
  subtitle: {
    color: "black",
    fontSize: width * 0.03,
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
  },
  iconImage: {
    width: width * 0.08,
    height: width * 0.08,
  },
  gridText: {
    color: "#6c5ce7",
    fontSize: width * 0.03,
    fontWeight: "500",
    marginTop: height * 0.01,
  },
  scrollableSection: {
    flex: 1,
    marginTop: height * 0.02,
  },
});

export default DashboardScreen;
