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
import { createUserRegistration } from "../../state/reducers/authSlice";
import { getDeviceType, getFCMToken } from "../../utilities/notifications";
import LoadingScreen from "../../components/Loader/Loader";

const { width, height } = Dimensions.get("window");

export default function RegistrationScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const validateForm = () => {
    if (accountNumber.length !== 11) {
      return "Account Number must be 11 digits";
    }
    if (pin.length !== 4) {
      return "PIN must be 4 digits";
    }
    if (confirmPin !== pin) {
      return "PINs do not match";
    }
    return "";
  };

  const handleRegister = async () => {
    const deviceToken = await getFCMToken();
    const deviceType = getDeviceType();
    const validationError = validateForm();
    console.log(accountNumber, pin, deviceToken, deviceType);
    if (validationError) {
      showMessage({
        message: validationError,
        backgroundColor: "#e2136e",
        type: "default",
        color: "white",
      });
    } else {
      dispatch(
        createUserRegistration({
          accountNumber,
          pin,
          deviceToken,
          deviceType,
        })
      )
        .unwrap()
        .then(() => {
          showMessage({
            message: "Registration successful!",
            type: "success",
            backgroundColor: "#4BB543",
            color: "white",
          });
          setTimeout(() => {
            navigation.navigate("Login");
          }, 1000);
        })
        .catch((error) => {
          showMessage({
            message: "Registration failed.",
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
              placeholder="Create TPin (4 digits)"
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
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
              placeholder="Confirm TPin (4 digits)"
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>REGISTER</Text>
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
});
