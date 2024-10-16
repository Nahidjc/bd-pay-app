import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useCurrencyFormatter } from "../utilities/helper/useCurrencyFormatter";
import LottieView from "lottie-react-native";
import checkingAnimation from "../assets/checking.json";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountBalance } from "../state/reducers/accountSlice";

const { width, height } = Dimensions.get("window");

const Card = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { balance, isLoading } = useSelector((state) => state.account);
  const [showBalance, setShowBalance] = useState(false);
  const { t } = useTranslation();
  const formatCurrency = useCurrencyFormatter();

  const handleRefresh = () => {
    dispatch(fetchAccountBalance(token))
      .unwrap()
      .then(() => {
        setShowBalance(true);
        setTimeout(() => {
          setShowBalance(false);
        }, 5000);
      });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Text style={styles.balanceLabel}>{t("balance_label")}</Text>
        <View style={styles.amountContainer}>
          {isLoading ? (
            <LottieView
              source={checkingAnimation}
              autoPlay
              loop
              style={styles.lottieLoader}
            />
          ) : (
            <Text style={styles.balanceAmount}>
              {showBalance ? `৳ ${formatCurrency(balance)}` : "৳ ****"}
            </Text>
          )}
          {!showBalance ? (
            <Pressable onPress={handleRefresh} style={styles.refreshButton}>
              <Image
                source={require("../assets/icon/show.png")}
                style={styles.refreshIcon}
              />
            </Pressable>
          ) : (
            showBalance && (
              <Pressable style={styles.refreshButton}>
                <Image
                  source={require("../assets/icon/hide.png")}
                  style={styles.refreshIcon}
                />
              </Pressable>
            )
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.01,
  },
  card: {
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  balanceLabel: {
    color: "#000",
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceAmount: {
    color: "#000",
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  lottieLoader: {
    width: width * 0.2,
    height: width * 0.1,
    fontSize: width * 0.06,
  },
  refreshButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    backgroundColor: "#00bcd4",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: width * 0.025,
  },
  refreshIcon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: "#fff",
  },
});

export default Card;
