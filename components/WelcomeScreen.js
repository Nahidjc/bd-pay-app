import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.brandText}>BD Pay Mobile Banking</Text>
        <Text style={styles.descriptionText}>
          Empowering your financial journey with seamless banking, secure
          transactions, and investment opportunities.
        </Text>
        <Text style={styles.swipeText}>Swipe to learn more →</Text>
      </View>
      <Image
        source={require("../assets/FinTech.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("Registration")}
        >
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
    backgroundColor: "#fff",
  },
  textContainer: {
    alignItems: "center",
    marginTop: height * 0.1,
  },
  welcomeText: {
    fontSize: height * 0.03,
    fontWeight: "bold",
    color: "#000",
  },
  brandText: {
    fontSize: height * 0.035,
    fontWeight: "bold",
    color: "#e2136e",
  },
  descriptionText: {
    fontSize: height * 0.02,
    textAlign: "center",
    marginVertical: height * 0.015,
    color: "#666",
  },
  swipeText: {
    fontSize: height * 0.018,
    color: "#e2136e",
    marginTop: height * 0.01,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: height * 0.05,
  },
  loginButton: {
    backgroundColor: "#e2136e",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: height * 0.02,
  },
  signUpButton: {
    backgroundColor: "#fff",
    borderColor: "#e2136e",
    borderWidth: 1,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 20,
  },
  signUpButtonText: {
    color: "#e2136e",
    fontWeight: "bold",
    fontSize: height * 0.02,
  },
});

export default WelcomeScreen;
