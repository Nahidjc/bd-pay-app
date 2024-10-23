import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import * as Keychain from "react-native-keychain";
import * as Application from "expo-application";
import axios from "axios";
import {
  clearBiometricData,
  getBiometricPublicKey,
  getBiometricsEnabled,
  getBiometricType,
  setBiometricPublicKey,
  setBiometricsEnabled,
  setBiometricStatus,
  setBiometricType,
  setDeviceId,
  StorageKeys,
} from "../../state/storage";
import { api } from "../config";
import { privatePost } from "../apiCaller";
const rnBiometrics = new ReactNativeBiometrics();
const deviceId = Application.applicationId;
export const checkBiometricSupport = async () => {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    const biometricStatus = {
      isAvailable: available,
      biometryType,
      isFaceID: biometryType === BiometryTypes.FaceID,
      isTouchID: biometryType === BiometryTypes.TouchID,
      isIris: biometryType === BiometryTypes.Iris,
      isBiometrics: biometryType === BiometryTypes.Biometrics,
    };
    setBiometricType(biometryType);
    setBiometricStatus(biometricStatus);
    return biometricStatus;
  } catch (error) {
    console.error("Error checking biometric support:", error);
    return {
      isAvailable: false,
      biometryType: null,
      isFaceID: false,
      isTouchID: false,
      isIris: false,
      isBiometrics: false,
    };
  }
};

export const handleBiometricAuth = async (payload) => {
  try {
    const { success, signature } = await ReactNativeBiometrics.createSignature({
      promptMessage: "Authenticate with biometrics",
      payload,
    });
    if (success) {
      return signature;
    }
    return null;
  } catch (error) {
    console.error("Error during biometric authentication:", error);
    return null;
  }
};

export const enableBiometrics = async (token) => {
  try {
    const isEnabled = getBiometricsEnabled();
    if (isEnabled) {
      return { success: true, message: "Biometrics already enabled" };
    }

    const { publicKey } = await rnBiometrics.createKeys();

    const biometricData = {
      publicKey,
      deviceId,
      biometryType: getBiometricType(),
    };
    const response = await privatePost(
      "/user/biometrics/register",
      token,
      biometricData
    );
    if (response.data.device) {
      setBiometricsEnabled(true);
      setBiometricPublicKey(publicKey);
      setDeviceId(deviceId);

      const keychainResult = await Keychain.setGenericPassword(
        "biometric_user",
        JSON.stringify(biometricData)
      );
      console.log("===============keychainResult===========", keychainResult);
      if (!keychainResult) {
        console.error("Failed to store biometric data in Keychain.");
        return {
          success: false,
          message: "Failed to store biometric data locally",
        };
      }

      return { success: true, message: "Biometrics enabled successfully" };
    }
    return { success: false, message: "Failed to register with server" };
  } catch (error) {
    console.error("Error enabling biometrics:", error);
    return { success: false, message: error.message };
  }
};

export const authenticateWithBiometrics = async (
  prompt = "Confirm your identity"
) => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) {
      throw new Error("No stored credentials found");
    }

    const { userId, publicKey } = JSON.parse(credentials.password);
    const storedPublicKey = getBiometricPublicKey();

    if (storedPublicKey !== publicKey) {
      throw new Error("Public key mismatch");
    }

    const challengeResponse = await axios.post(
      `${api}/user/biometrics/challenge`,
      {
        userId,
        deviceId,
      }
    );

    const { challenge } = challengeResponse.data;
    const { success, signature } = await rnBiometrics.createSignature({
      promptMessage: prompt,
      payload: challenge,
    });

    if (success) {
      const verificationResponse = await axios.post(
        `${api}/user/biometrics/verify`,
        {
          userId,
          signature,
          challenge,
          deviceId,
        }
      );

      if (verificationResponse.data.success) {
        setStorageItem(StorageKeys.Token, verificationResponse.data.token);
        setStorageItem(StorageKeys.IsAuthenticated, true);
        setStorageItem("lastBiometricAuth", Date.now());

        return {
          success: true,
          token: verificationResponse.data.token,
          message: "Authentication successful",
        };
      }
    }

    return { success: false, message: "Biometric authentication failed" };
  } catch (error) {
    console.error("Error during authentication:", error);
    return { success: false, message: error.message };
  }
};

export const disableBiometrics = async (token) => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const { publicKey } = JSON.parse(credentials.password);

      const biometricData = {
        publicKey,
        deviceId,
      };
      await privatePost("/user/biometrics/disable", token, biometricData);
      await rnBiometrics.deleteKeys();

      clearBiometricData();
      await Keychain.resetGenericPassword();
      return { success: true, message: "Biometrics disabled successfully" };
    }
    return { success: false, message: "No biometric data found" };
  } catch (error) {
    console.error("Error disabling biometrics:", error);
    return { success: false, message: error.message };
  }
};

export const isBiometricsEnabled = async () => {
  try {
    const isEnabled = getBiometricsEnabled();
    const credentials = await Keychain.getGenericPassword();
    return Boolean(isEnabled && credentials);
  } catch (error) {
    console.error("Error checking biometric status:", error);
    return false;
  }
};
