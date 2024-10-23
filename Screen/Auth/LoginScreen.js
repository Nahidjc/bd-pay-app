import React, { useState, useEffect } from "react";
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
  Modal,
} from "react-native";
import { X } from "lucide-react-native";
import { showMessage } from "react-native-flash-message";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { createUserLogin } from "../../state/reducers/authSlice";
import LoadingScreen from "../../components/Loader/Loader";
import {
  checkBiometricSupport,
  isBiometricsEnabled,
  authenticateWithBiometrics,
} from "../../utilities/biometrics/BiometricsUtils";
import {
  deleteAccountNumberStorage,
  getAccountNumberStorage,
  setAccountNumberStorage,
} from "../../state/storage";

const window = Dimensions.get("window");
const { height } = Dimensions.get("window");
const scale = (size) => (window.width / 375) * size;

const BIOMETRIC_MESSAGES = {
  NOT_ENABLED:
    "Biometric login is not enabled. Would you like to enable it now?",
  NO_ID: "Please save your User ID first to use biometric login",
  SUCCESS: "Login successful!",
  FAILED: "Biometric verification failed",
  CANCELLED: "Authentication was cancelled",
};
export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [biometricStatus, setBiometricStatus] = useState({
    isAvailable: false,
    isEnabled: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaveIdEnabled, setIsSaveIdEnabled] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  useEffect(() => {
    initializeBiometrics();
    loadSavedUserId();
  }, []);

  const initializeBiometrics = async () => {
    try {
      const supportStatus = await checkBiometricSupport();
      const enabledStatus = await isBiometricsEnabled();
      setBiometricStatus({
        isAvailable: supportStatus.isAvailable,
        isEnabled: enabledStatus.isEnabled,
      });
    } catch (error) {
      console.error("Biometrics initialization failed:", error);
    }
  };

  const loadSavedUserId = async () => {
    try {
      const savedId = await getAccountNumberStorage();
      if (savedId) {
        setAccountNumber(savedId);
        setIsSaveIdEnabled(true);
      }
    } catch (error) {
      console.error("Error loading saved ID:", error);
    }
  };

  const toggleSaveId = async () => {
    try {
      if (isSaveIdEnabled) {
        await deleteAccountNumberStorage();
        setIsSaveIdEnabled(false);
      } else if (accountNumber) {
        await setAccountNumberStorage(accountNumber);
        setIsSaveIdEnabled(true);
      } else {
        showMessage({
          message: "Please enter Account Number",
          type: "warning",
          backgroundColor: "#ff9800",
        });
      }
    } catch (error) {
      showMessage({
        message: "Failed to save ID",
        type: "danger",
        backgroundColor: "#e2136e",
      });
    }
  };

  const handleBiometricLogin = async () => {
    try {
      if (!biometricStatus || !biometricStatus.isEnabled) {
        setShowBiometricModal(true);
        return;
      }
      const authResult = await authenticateWithBiometrics(
        "Verify your identity"
      );

      if (!authResult?.token) {
        throw new Error(BIOMETRIC_MESSAGES.FAILED);
      }
      showMessage({
        message: BIOMETRIC_MESSAGES.SUCCESS,
        type: "success",
        backgroundColor: "#4BB543",
        duration: 2000,
      });
    } catch (error) {
      if (error.name === "BiometricError" && error.code === "USER_CANCELED") {
        return;
      }
      showMessage({
        message: error.message || BIOMETRIC_MESSAGES.FAILED,
        type: "danger",
        backgroundColor: "#e2136e",
        duration: 3000,
      });
    }
  };

  const handleLogin = async () => {
    if (!accountNumber || !pin) {
      showMessage({
        message: !accountNumber
          ? "Please enter User ID"
          : "Please enter Password",
        type: "danger",
        backgroundColor: "#e2136e",
      });
      return;
    }

    try {
      if (isSaveIdEnabled) {
        await setAccountNumberStorage(accountNumber);
      }

      await dispatch(createUserLogin({ accountNumber, pin })).unwrap();

      showMessage({
        message: "Login successful!",
        type: "success",
        backgroundColor: "#4BB543",
      });
    } catch (error) {
      showMessage({
        message: error.message || "Login failed",
        type: "danger",
        backgroundColor: "#e2136e",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <LoadingScreen visible={isLoading} />
            <View style={styles.header}>
              <Text style={styles.title}>Log In</Text>
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
                  placeholder="Enter User ID"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  autoCapitalize="none"
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.saveIdButton}
                  onPress={toggleSaveId}
                >
                  <MaterialIcons
                    name={
                      isSaveIdEnabled ? "check-box" : "check-box-outline-blank"
                    }
                    size={scale(24)}
                    color={isSaveIdEnabled ? "#4CAF50" : "#666"}
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
                  placeholder="Enter Password"
                  value={pin}
                  onChangeText={setPin}
                  secureTextEntry={!showPassword}
                  maxLength={6}
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

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotContainer}
            >
              <Text style={styles.forgotText}>Forgot ID or Password?</Text>
            </TouchableOpacity>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { marginRight: biometricStatus.isAvailable ? scale(12) : 0 },
                ]}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              {biometricStatus.isAvailable && (
                <TouchableOpacity
                  style={styles.biometricButton}
                  onPress={handleBiometricLogin}
                >
                  <MaterialIcons
                    name="fingerprint"
                    size={scale(32)}
                    color="#e2136e"
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New to BD Pay? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Registration")}
              >
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showBiometricModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBiometricModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowBiometricModal(false)}
            >
              <X size={24} color="#FF0000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Biometric Disabled</Text>
            <Text style={styles.modalText}>
              Your biometrics are not enabled. Please enable them from the user
              profile.
            </Text>
          </View>
        </View>
      </Modal>
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
  saveIdButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  visibilityButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  forgotContainer: {
    alignItems: "center",
    marginBottom: scale(24),
  },
  forgotText: {
    color: "#00A884",
    fontSize: scale(16),
    textDecorationLine: "underline",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(32),
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#e2136e",
    height: scale(45),
    borderRadius: scale(8),
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: scale(18),
    fontWeight: "600",
  },
  biometricButton: {
    width: scale(50),
    height: scale(45),
    backgroundColor: "#f5f5f5",
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(20),
  },
  signupText: {
    fontSize: scale(16),
    color: "#666",
  },
  signupLink: {
    fontSize: scale(16),
    color: "#00A884",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});
