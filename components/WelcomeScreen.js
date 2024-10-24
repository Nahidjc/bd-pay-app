import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Maintenance from "../assets/svgs/maintenance.svg";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#fff",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  brandText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e2136e",
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    color: "#666",
  },
  swipeText: {
    fontSize: 14,
    color: "#e2136e",
    marginTop: 10,
  },
  image: {
    width: width * 0.8,
    height: height * 0.5,
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: "#e2136e",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: "#fff",
    borderColor: "#e2136e",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  signUpButtonText: {
    color: "#e2136e",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default WelcomeScreen;
