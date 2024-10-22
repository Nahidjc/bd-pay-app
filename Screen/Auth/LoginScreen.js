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
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { createUserLogin } from "../../state/reducers/authSlice";
import LoadingScreen from "../../components/Loader/Loader";
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { deleteAccountNumberStorage, getAccountNumberStorage, setAccountNumberStorage } from "../../state/storage";

const { width, height } = Dimensions.get("window");
const rnBiometrics = new ReactNativeBiometrics();

const scale = size => (width / 375) * size;

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaveIdEnabled, setIsSaveIdEnabled] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    loadSavedUserId();
  }, []);

  const loadSavedUserId = () => {
    try {
      const savedId = getAccountNumberStorage();
      if (savedId) {
        setAccountNumber(savedId);
        setIsSaveIdEnabled(true);
      }
    } catch (error) {
      console.error('Error loading saved ID:', error);
    }
  };
  

  const toggleSaveId = () => {
    try {
      if (isSaveIdEnabled) {
        deleteAccountNumberStorage()
        setIsSaveIdEnabled(false);
      } else {
        if (accountNumber) {
          setAccountNumberStorage(accountNumber);
          setIsSaveIdEnabled(true);
        } else {
          showMessage({
            message: "Please enter a User ID first",
            type: "warning",
            backgroundColor: "#ff9800",
            color: "white",
          });
        }
      }
    } catch (error) {
      console.error('Error toggling save ID:', error);
      showMessage({
        message: "Failed to save ID",
        type: "danger",
        backgroundColor: "#e2136e",
        color: "white",
      });
    }
  };

  const checkBiometricSupport = async () => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      setIsBiometricSupported(available && biometryType === BiometryTypes.Biometrics);
    } catch (error) {
      console.error('Biometrics check failed:', error);
      setIsBiometricSupported(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const { publicKey } = await rnBiometrics.biometricKeysExist();
      
      if (!publicKey) {
        const { publicKey: newKey } = await rnBiometrics.createKeys();
      }

      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Login with Fingerprint',
        payload: 'login-payload',
        cancelButtonText: 'Cancel',
      });

      if (success) {
        handleBiometricLogin(signature);
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      showMessage({
        message: "Fingerprint authentication failed",
        type: "danger",
        backgroundColor: "#e2136e",
        color: "white",
      });
    }
  };

  const handleBiometricLogin = async (signature) => {
    try {
      const savedId = getAccountNumberStorage();
      if (!savedId) {
        showMessage({
          message: "No saved credentials found",
          type: "warning",
          backgroundColor: "#ff9800",
          color: "white",
        });
        return;
      }

      dispatch(
        createUserLogin({
          accountNumber: savedId,
          biometricSignature: signature
        })
      )
        .unwrap()
        .then(() => {
          showMessage({
            message: "Biometric login successful!",
            type: "success",
            backgroundColor: "#4BB543",
            color: "white",
          });
        })
        .catch((error) => {
          showMessage({
            message: error.message || "Biometric login failed.",
            type: "danger",
            backgroundColor: "#e2136e",
            color: "white",
          });
        });
    } catch (error) {
      console.error('Biometric login error:', error);
      showMessage({
        message: "Biometric login failed",
        type: "danger",
        backgroundColor: "#e2136e",
        color: "white",
      });
    }
  };

  const validateForm = () => {
    if (accountNumber.length === 0) {
      return "Please enter User ID";
    }
    if (pin.length === 0) {
      return "Please enter Password";
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
      if (isSaveIdEnabled) {
        setAccountNumberStorage(accountNumber);
      }
  
      dispatch(createUserLogin({ accountNumber, pin }))
        .unwrap()
        .then(() => {
          handleSuccessfulLogin();
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
  const handleSuccessfulLogin = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      if (available) {
        const { publicKey } = await rnBiometrics.biometricKeysExist();
        if (!publicKey) {
          await rnBiometrics.createKeys();
        }
      }
    } catch (error) {
      console.error('Error setting up biometric login:', error);
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
              <Text style={styles.subtitle}>BD Pay</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person-outline" size={scale(24)} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter User ID"
                  value={accountNumber}
                  onChangeText={(text) => {
                    setAccountNumber(text);
                    if (isSaveIdEnabled && !text) {
                      setIsSaveIdEnabled(false);
                    }
                  }}
                  autoCapitalize="none"
                  keyboardType="numeric" 
                />
                <TouchableOpacity
                  style={[
                    styles.saveIdButton,
                    isSaveIdEnabled && styles.saveIdButtonActive
                  ]}
                  onPress={toggleSaveId}
                >
                  <MaterialIcons
                    name={isSaveIdEnabled ? "check-box" : "check-box-outline-blank"}
                    size={scale(24)}
                    color={isSaveIdEnabled ? "#4CAF50" : "#666"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock-outline" size={scale(24)} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  value={pin}
                  onChangeText={setPin}
                  secureTextEntry={!showPassword}
                  keyboardType="number-pad"
                  maxLength={6} 
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={scale(24)} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotContainer}
            >
              <Text style={styles.forgotText}>Forgot ID or Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {isBiometricSupported && (
              <TouchableOpacity 
                style={styles.fingerprintButton} 
                onPress={handleBiometricAuth}
              >
                <MaterialIcons name="fingerprint" size={scale(40)} color="#666" />
              </TouchableOpacity>
            )}

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New to BD Pay? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
                <Text style={styles.signupLink}>Sign Up</Text>
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
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    justifyContent: 'center',
    minHeight: height * 0.8,
  },
  header: {
    marginBottom: scale(40),
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: scale(26),
    fontWeight: '600',
    color: '#333', 
    marginRight: scale(10), 
  },
  subtitle: {
    fontSize: scale(26),
    fontWeight: '600',
    color: '#00A884', 
    paddingLeft: scale(5), 
  },
  inputContainer: {
    marginBottom: scale(20),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: scale(12),
    marginBottom: scale(16),
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    fontSize: scale(14),
    color: "#333",
    paddingVertical: Platform.OS === 'ios' ? scale(12) : scale(4),
  },
  saveIdButton: {
    padding: scale(4),
  },
  saveIdButtonActive: {
    opacity: 1,
  },
  forgotContainer: {
    alignItems: 'center',
    marginBottom: scale(24),
  },
  forgotText: {
    color: "#00A884",
    fontSize: scale(16),
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#e2136e",
    paddingVertical: scale(12),
    borderRadius: scale(12),
    alignItems: "center",
    marginBottom: scale(20),
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: scale(14),
    fontWeight: "600",
  },
  fingerprintButton: {
    alignItems: "center",
    padding: scale(16),
    marginBottom: scale(20),
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
});