import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Card from "../components/Card";
import TransactionList from "../components/TransactionList";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

const DashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const features = [
    {
      image: require("../assets/icon/send.png"),
      text: t("send"),
      navigate: "InitialSendMoney",
    },
    {
      image: require("../assets/icon/cash-out.png"),
      text: t("cashOut"),
      navigate: "InitialCashOutScreen",
    },
    {
      image: require("../assets/icon/payment.png"),
      text: t("payment"),
      navigate: null,
    },
    {
      image: require("../assets/icon/add-money.png"),
      text: t("addMoney"),
      navigate: "AddMoneyScreen",
    },
    {
      image: require("../assets/icon/auto.png"),
      text: "Auto Pay",
      navigate: null,
    },
    {
      image: require("../assets/icon/remittance.png"),
      text: "Remittance",
      navigate: null,
    },
    {
      image: require("../assets/icon/donate.png"),
      text: "Donation",
      navigate: null,
    },
    {
      image: require("../assets/icon/govt.png"),
      text: "Govt. Pay",
      navigate: null,
    },
  ];

  const handlePress = (feature) => {
    if (feature.navigate) {
      navigation.navigate(feature.navigate);
    } else {
      setModalVisible(true);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <Card />
        <View style={styles.gridContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.gridItemContainer}>
              <TouchableOpacity
                style={styles.iconBox}
                onPress={() => handlePress(feature)}
              >
                <Image source={feature.image} style={styles.iconImage} />
              </TouchableOpacity>
              <Text style={styles.gridText}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.scrollableSection}>
        <TransactionList />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Warning</Text>
                <Image
                  source={require("../assets/icon/warning.png")}
                  style={styles.modalImage}
                />
                <Text style={styles.modalText}>
                  This feature will be coming soon
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Okay</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    flexWrap: "wrap",
  },
  gridItemContainer: {
    width: width * 0.22,
    alignItems: "center",
    paddingVertical: height * 0.01,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: width * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalImage: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: 15,
  },
  modalText: {
    fontSize: width * 0.04,
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  modalButton: {
    backgroundColor: "#D4AF37",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
});

export default DashboardScreen;
