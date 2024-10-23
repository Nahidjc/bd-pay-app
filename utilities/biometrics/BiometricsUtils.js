import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import * as Keychain from "react-native-keychain";
import * as Application from "expo-application";
import DeviceInfo from "react-native-device-info";
import {
  clearBiometricData,
  getBiometricPublicKey,
  getBiometricsEnabled,
  setBiometricPublicKey,
  setBiometricsEnabled,
  setBiometricStatus,
  setBiometricType,
  setDeviceId,
  StorageKeys,
} from "../../state/storage";
import { privatePost, publicPost } from "../apiCaller";

const CONSTANTS = {
  BIOMETRIC_USER: "biometric_user",
  DEFAULT_PROMPT: "Verify your identity",
  MAX_RETRIES: 30,
  RETRY_DELAY: 500,
  ERROR_CODES: {
    BIOMETRIC_NOT_AVAILABLE: "BIOMETRIC_NOT_AVAILABLE",
    BIOMETRIC_NOT_ENROLLED: "BIOMETRIC_NOT_ENROLLED",
    BIOMETRIC_CANCELLED: "BIOMETRIC_CANCELLED",
    BIOMETRIC_ERROR: "BIOMETRIC_ERROR",
    NETWORK_ERROR: "NETWORK_ERROR",
    STORAGE_ERROR: "STORAGE_ERROR",
    VERIFICATION_FAILED: "VERIFICATION_FAILED",
  },
  ERROR_MESSAGES: {
    BIOMETRIC_NOT_AVAILABLE: "Biometric authentication is not available",
    BIOMETRIC_NOT_ENROLLED: "No biometric data found on device",
    BIOMETRIC_CANCELLED: "Authentication was cancelled",
    BIOMETRIC_ERROR: "Biometric authentication failed",
    NETWORK_ERROR: "Network connection error",
    STORAGE_ERROR: "Error accessing secure storage",
    VERIFICATION_FAILED: "Server verification failed",
  },
};
const deviceId = DeviceInfo.getDeviceId();
const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

const validateStoredCredentials = (credentials) => {
  if (
    !credentials?.biometryType ||
    !credentials?.publicKey ||
    !credentials?.deviceId
  ) {
    throw new Error(CONSTANTS.ERROR_MESSAGES.STORAGE_ERROR);
  }
  return true;
};

const handleBiometricError = (error) => {
  if (error.code === "USER_CANCELED") {
    return new Error(CONSTANTS.ERROR_MESSAGES.BIOMETRIC_CANCELLED);
  }
  if (error.code === "NOT_AVAILABLE") {
    return new Error(CONSTANTS.ERROR_MESSAGES.BIOMETRIC_NOT_AVAILABLE);
  }
  if (error.code === "NOT_ENROLLED") {
    return new Error(CONSTANTS.ERROR_MESSAGES.BIOMETRIC_NOT_ENROLLED);
  }
  return error;
};

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

const confirmBiometricIdentity = async (
  promptMessage = "Confirm your identity"
) => {
  const { success } = await rnBiometrics.simplePrompt({
    promptMessage,
    cancelButtonText: "Cancel",
    fallbackPromptMessage: "Use device Passcode",
  });

  if (!success) {
    throw new Error("Biometric authentication failed");
  }
};

export const enableBiometrics = async (token, userId) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }
    const { biometryType } = await rnBiometrics.isSensorAvailable();
    if (await getBiometricsEnabled()) {
      return "Biometrics already enabled";
    }
    await confirmBiometricIdentity("Confirm your identity to enable biometric");
    const { publicKey } = await rnBiometrics.createKeys();
    const biometricData = {
      publicKey,
      deviceId,
      biometryType,
      userId,
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

export const disableBiometrics = async (token) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }
    await confirmBiometricIdentity(
      "Confirm your identity to disable biometric"
    );
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

export const authenticateWithBiometrics = async (
  prompt = CONSTANTS.DEFAULT_PROMPT
) => {
  let attempts = 0;

  const attemptAuthentication = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      if (!available) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.BIOMETRIC_NOT_AVAILABLE);
      }
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.STORAGE_ERROR);
      }
      const storedData = JSON.parse(credentials.password);
      validateStoredCredentials(storedData);
      const storedPublicKey = await getBiometricPublicKey();
      if (storedPublicKey !== storedData.publicKey) {
        await cleanup();
        throw new Error(CONSTANTS.ERROR_MESSAGES.VERIFICATION_FAILED);
      }

      const challengeResponse = await publicPost("/user/biometrics/challenge", {
        userId: storedData.userId,
        deviceId,
      });

      if (!challengeResponse?.data?.success) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR);
      }

      const { challenge } = challengeResponse.data;
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: prompt,
        payload: challenge,
        cancelButtonText: "Cancel",
        fallbackPromptMessage: "Use device PassCode",
      });

      if (!success || !signature) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.BIOMETRIC_ERROR);
      }
      const verificationResponse = await publicPost("/user/biometrics/verify", {
        userId: storedData.userId,
        deviceId,
        challenge,
        signature,
      });

      if (!verificationResponse?.data?.success) {
        throw new Error(CONSTANTS.ERROR_MESSAGES.VERIFICATION_FAILED);
      }

      return {
        success: verificationResponse.data.success,
        data: verificationResponse.data,
      };
    } catch (error) {
      const biometricError = handleBiometricError(error);

      if (
        biometricError.message !== CONSTANTS.ERROR_MESSAGES.BIOMETRIC_CANCELLED
      ) {
        attempts++;
        if (attempts < CONSTANTS.MAX_RETRIES) {
          return attemptAuthentication();
        }
      }

      throw biometricError;
    }
  };

  try {
    const result = await attemptAuthentication();
    return result.data;
  } catch (error) {
    if (attempts >= CONSTANTS.MAX_RETRIES) {
      await cleanup();
    }
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
