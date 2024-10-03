import React from "react";
import { View, Modal, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import LottieView from "lottie-react-native";

const LoadingScreen = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
      statusBarTranslucent={true}
    >
      {/* <StatusBar hidden={true} /> */}

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <View style={styles.loaderBackground}>
            <LottieView
              source={require("./bkash.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBackground: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default LoadingScreen;
