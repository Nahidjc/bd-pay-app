import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";
import { getDeviceType, getFCMToken } from "./../../utilities/notifications";
import { createUserRegistration } from "../../state/reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "./../../components/Loader/Loader";
const window = Dimensions.get("window");
const { height } = Dimensions.get("window");
const scale = (size) => (window.width / 375) * size;

export default function RegistrationScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (accountNumber.length !== 11) {
      return "Account Number must be 11 digits";
    }
    if (password.length !== 4) {
      return "PIN must be 4 digits";
    }
    if (confirmPassword !== password) {
      return "PINs do not match";
    }
    return "";
  };

  const handleRegister = async () => {
    const deviceToken = await getFCMToken();
    const deviceType = getDeviceType();
    const validationError = validateForm();

    if (validationError) {
      showMessage({
        message: validationError,
        backgroundColor: "#e2136e",
        type: "default",
        color: "white",
      });
      return;
    }

    try {
      const response = await dispatch(
        createUserRegistration({
          accountNumber,
          pin: password,
          deviceToken,
          deviceType,
        })
      ).unwrap();
      showMessage({
        message: response.message || "Registration successful!",
        type: "success",
        backgroundColor: "#4BB543",
        color: "white",
      });

      setTimeout(() => {
        navigation.navigate("Login");
      }, 500);
    } catch (error) {
      showMessage({
        message:
          error.data.error || error.data.message || "Registration failed.",
        type: "danger",
        backgroundColor: "#e2136e",
        color: "white",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingScreen visible={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Registration</Text>
              <Text style={styles.subtitle}>BD Pay Mobile Banking</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="person-outline"
                  size={scale(24)}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Account Number"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  autoCapitalize="none"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="lock-outline"
                  size={scale(24)}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  keyboardType="numeric"
                  maxLength={4}
                />
                <TouchableOpacity
                  style={styles.visibilityButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={scale(24)}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="lock-outline"
                  size={scale(24)}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  keyboardType="numeric"
                  maxLength={4}
                />
                <TouchableOpacity
                  style={styles.visibilityButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={scale(24)}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    justifyContent: "center",
    minHeight: height * 0.8,
  },
  header: {
    marginBottom: scale(40),
  },
  title: {
    fontSize: scale(28),
    color: "#333",
    marginBottom: scale(8),
  },
  subtitle: {
    fontSize: scale(22),
    fontWeight: "600",
    color: "#e2136e",
  },
  inputContainer: {
    marginBottom: scale(20),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: scale(12),
    marginBottom: scale(16),
    height: scale(56),
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginLeft: scale(16),
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    fontSize: scale(16),
    color: "#333",
    paddingVertical: Platform.OS === "ios" ? scale(12) : scale(8),
  },
  visibilityButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  actionContainer: {
    marginBottom: scale(32),
  },
  registerButton: {
    backgroundColor: "#e2136e",
    height: scale(45),
    borderRadius: scale(8),
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: scale(18),
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(20),
  },
  loginText: {
    fontSize: scale(16),
    color: "#666",
  },
  loginLink: {
    fontSize: scale(16),
    color: "#00A884",
    fontWeight: "600",
  },
});
