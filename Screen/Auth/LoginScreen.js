import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import BkashSVG from "../../assets/svgs/bkash.svg";
import { useDispatch, useSelector } from "react-redux";
import { createUserLogin } from "../../state/reducers/authSlice";
import LoadingScreen from "../../components/Loader/Loader";

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");

  const validateForm = () => {
    if (accountNumber.length !== 11) {
      return "Account Number must be 11 digits";
    }
    if (pin.length !== 4) {
      return "PIN must be 4 digits";
    }
    return "";
  };

  const handleLogin = async () => {
    const validationError = validateForm();
    if (validationError) {
      showMessage({
        message: validationError,
        backgroundColor: "#e2136e",
        type: "default",
        color: "white",
      });
    } else {
      dispatch(
        createUserLogin({
          accountNumber,
          pin,
        })
      )
        .unwrap()
        .then(() => {
          showMessage({
            message: "Login successful!",
            type: "success",
            backgroundColor: "#4BB543",
            color: "white",
          });
        })
        .catch((error) => {
          showMessage({
            message: error.message || "Login failed.",
            type: "danger",
            backgroundColor: "#e2136e",
            color: "white",
          });
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingScreen visible={isLoading} />
      <View style={styles.content}>
        <BkashSVG width={width} height={height * 0.15} />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <FontAwesome
              name="user"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Account Number (11 digits)"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
              maxLength={11}
            />
          </View>

          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="lock"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="TPin (4 digits)"
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Registration")}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#e2136e",
    paddingVertical: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 15,
  },
  registerText: {
    color: "#e2136e",
  },
});
