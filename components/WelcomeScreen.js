import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SvgUri } from "react-native-svg";
const WelcomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.brandText}>Real Life IQ</Text>
        <Text style={styles.descriptionText}>
          Get access to the tools you need to invest, spend, and put your money
          in motion.
        </Text>
        <Text style={styles.swipeText}>Swipe to learn more →</Text>
      </View>
      <SvgUri
        width="100%"
        height="200"
        uri="https://modernize-react.adminmart.com/assets/maintenance-ab9a84ac.svg"
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
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    color: "red",
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    color: "#666",
  },
  swipeText: {
    fontSize: 14,
    color: "red",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: "#fff",
    borderColor: "red",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  loginButtonText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  signUpButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default WelcomeScreen;
