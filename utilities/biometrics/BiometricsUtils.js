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

const CONSTANTS = {
  BIOMETRIC_USER: "biometric_user",
  DEFAULT_PROMPT: "Confirm your identity",
  ERROR_CODES: {
    NO_SENSOR: "NO_SENSOR",
    AUTH_FAILED: "AUTH_FAILED",
    SERVER_ERROR: "SERVER_ERROR",
    STORAGE_ERROR: "STORAGE_ERROR",
  },
};

const rnBiometrics = new ReactNativeBiometrics();
const deviceId = Application.applicationId;

const validateBiometricData = (data) => {
  const { publicKey, userId } = data;
  if (!publicKey || typeof publicKey !== "string") {
    throw new Error("Invalid public key");
  }
  if (userId && typeof userId !== "string") {
    throw new Error("Invalid user ID");
  }
  return true;
};

export const checkBiometricSupport = async () => {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      throw new Error("Biometric sensor not available");
    }

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
    console.error("Error checking biometric support:", error.message);
    throw error;
  }
};

export const handleBiometricAuth = async (payload) => {
  try {
    if (!payload) {
      throw new Error("Payload is required");
    }

    const { success, signature } = await rnBiometrics.createSignature({
      promptMessage: CONSTANTS.DEFAULT_PROMPT,
      payload,
    });

    if (!success || !signature) {
      throw new Error("Authentication failed");
    }

    return { signature };
  } catch (error) {
    console.error("Authentication failed:", error.message);
    throw error;
  }
};

export const enableBiometrics = async (token) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }
    const { biometryType } = await rnBiometrics.isSensorAvailable();
    if (await getBiometricsEnabled()) {
      return "Biometrics already enabled";
    }
    const { publicKey } = await rnBiometrics.createKeys();
    const biometricData = {
      publicKey,
      deviceId,
      biometryType,
    };

    validateBiometricData(biometricData);

    const response = await privatePost(
      "/user/biometrics/register",
      token,
      biometricData
    );

    if (!response?.data?.device) {
      throw new Error("Server registration failed");
    }

    const keychainResult = await Keychain.setGenericPassword(
      CONSTANTS.BIOMETRIC_USER,
      JSON.stringify(biometricData)
    );

    if (!keychainResult) {
      throw new Error("Failed to store biometric data");
    }

    setBiometricsEnabled(true);
    setBiometricPublicKey(publicKey);
    setDeviceId(deviceId);

    return response;
  } catch (error) {
    await cleanup();
    throw error;
  }
};

export const authenticateWithBiometrics = async (
  prompt = CONSTANTS.DEFAULT_PROMPT
) => {
  const MAX_RETRIES = 3;
  let attempts = 0;

  const attemptAuthentication = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        throw new Error("No stored credentials");
      }

      const { userId, publicKey } = JSON.parse(credentials.password);
      validateBiometricData({ userId, publicKey });

      const storedPublicKey = getBiometricPublicKey();
      if (storedPublicKey !== publicKey) {
        throw new Error("Public key mismatch");
      }

      const {
        data: { challenge },
      } = await axios.post(`${api}/user/biometrics/challenge`, {
        userId,
        deviceId,
      });

      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: prompt,
        payload: challenge,
      });

      if (!success) {
        throw new Error("Signature creation failed");
      }

      const verificationResponse = await axios.post(
        `${api}/user/biometrics/verify`,
        { userId, signature, challenge, deviceId }
      );

      if (!verificationResponse.data.success) {
        throw new Error("Verification failed");
      }

      const { token } = verificationResponse.data;
      await Promise.all([
        setStorageItem(StorageKeys.Token, token),
        setStorageItem(StorageKeys.IsAuthenticated, true),
        setStorageItem("lastBiometricAuth", Date.now()),
      ]);

      return { token };
    } catch (error) {
      attempts++;
      if (attempts >= MAX_RETRIES) {
        throw error;
      }
      return attemptAuthentication();
    }
  };

  try {
    return await attemptAuthentication();
  } catch (error) {
    console.error("Authentication failed:", error.message);
    throw error;
  }
};

export const disableBiometrics = async (token) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }

    const credentials = await Keychain.getGenericPassword();
    if (!credentials) {
      return "No biometric data found";
    }

    const { publicKey } = JSON.parse(credentials.password);
    validateBiometricData({ publicKey });

    const response = await privatePost("/user/biometrics/disable", token, {
      publicKey,
      deviceId,
    });

    if (!response?.data?.success) {
      throw new Error("Server disable failed");
    }

    await Promise.all([
      rnBiometrics.deleteKeys(),
      Keychain.resetGenericPassword(),
      clearBiometricData(),
    ]);

    return response;
  } catch (error) {
    console.error("Error disabling biometrics:", error.message);
    throw error;
  }
};

export const isBiometricsEnabled = async () => {
  try {
    const [isEnabled, credentials] = await Promise.all([
      getBiometricsEnabled(),
      Keychain.getGenericPassword(),
    ]);

    return { isEnabled: Boolean(isEnabled && credentials) };
  } catch (error) {
    console.error("Error checking biometrics status:", error.message);
    throw error;
  }
};

const cleanup = async () => {
  try {
    await Promise.all([
      rnBiometrics.deleteKeys(),
      Keychain.resetGenericPassword(),
      clearBiometricData(),
    ]);
  } catch (error) {
    console.error("Cleanup failed:", error.message);
  }
};
