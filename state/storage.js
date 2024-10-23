import { MMKV } from "react-native-mmkv";
import * as Application from "expo-application";

export const StorageKeys = {
  User: "user",
  IsAuthenticated: "isAuthenticated",
  Token: "token",
  Language: "language",
  Onboarding: "onboarded",
  AccountNumber: "accountNumber",
  BiometricsEnabled: "biometricsEnabled",
  BiometricPublicKey: "biometricPublicKey",
  BiometricStatus: "biometricStatus",
  DeviceId: "deviceId",
  BiometricType: "biometricType",
};

const storageId = `${Application.applicationId}-mmkv`;
export const storage = new MMKV({ id: storageId });

export const saveUserData = (user, token, accountNumber) => {
  try {
    storage.set(StorageKeys.User, JSON.stringify(user));
    storage.set(StorageKeys.Token, token);
    storage.set(StorageKeys.AccountNumber, accountNumber);
    storage.set(StorageKeys.IsAuthenticated, "true");
    console.log(
      "User data, token, account number, and authentication status saved"
    );
  } catch (e) {
    console.error("Error saving user data:", e);
  }
};

export const getUserData = () => {
  try {
    const userData = storage.getString(StorageKeys.User);
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error("Error retrieving user data:", e);
    return null;
  }
};

export const isAuthenticated = () => {
  return storage.getString(StorageKeys.IsAuthenticated) === "true";
};

export const clearUserData = () => {
  storage.delete(StorageKeys.User);
  storage.delete(StorageKeys.IsAuthenticated);
  storage.delete(StorageKeys.Token);
  storage.delete(StorageKeys.AccountNumber);
};

export const setOnboardingStatus = (status) => {
  storage.set(StorageKeys.Onboarding, status ? "true" : "false");
};

export const getOnboardingStatus = () => {
  return storage.getString(StorageKeys.Onboarding) === "true";
};

export const setLanguage = (language) => {
  storage.set(StorageKeys.Language, language);
};

export const getLanguage = () => {
  return storage.getString(StorageKeys.Language) || "en";
};

export const getToken = () => {
  try {
    return storage.getString(StorageKeys.Token);
  } catch (e) {
    console.error("Error retrieving token:", e);
    return null;
  }
};

export const setAccountNumberStorage = (accountNumber) => {
  try {
    storage.set(StorageKeys.AccountNumber, accountNumber);
    console.log("Account number saved successfully");
  } catch (e) {
    console.error("Error saving account number:", e);
  }
};

export const getAccountNumberStorage = () => {
  try {
    return storage.getString(StorageKeys.AccountNumber);
  } catch (e) {
    console.error("Error retrieving account number:", e);
    return null;
  }
};
export const deleteAccountNumberStorage = () => {
  try {
    return storage.delete(StorageKeys.AccountNumber);
  } catch (e) {
    console.error("Error retrieving account number:", e);
    return null;
  }
};

// BiometricPublicKey methods
export const setBiometricPublicKey = (publicKey) => {
  try {
    if (!publicKey) {
      throw new Error('Public key cannot be empty');
    }
    storage.set(StorageKeys.BiometricPublicKey, publicKey);
    console.log('Biometric public key stored successfully');
  } catch (error) {
    console.error('Error setting biometric public key:', error);
    throw error;
  }
};

export const getBiometricPublicKey = () => {
  try {
    const publicKey = storage.getString(StorageKeys.BiometricPublicKey);
    return publicKey || null;
  } catch (error) {
    console.error('Error retrieving biometric public key:', error);
    return null;
  }
};

// BiometricStatus methods
export const setBiometricStatus = (status) => {
  try {
    storage.set(StorageKeys.BiometricStatus, JSON.stringify(status));
    console.log('Biometric status updated:', status);
  } catch (error) {
    console.error('Error setting biometric status:', error);
    throw error;
  }
};

export const getBiometricStatus = () => {
  try {
    const status = storage.getString(StorageKeys.BiometricStatus);
    return status ? JSON.parse(status) : null;
  } catch (error) {
    console.error('Error retrieving biometric status:', error);
    return null;
  }
};

// DeviceId methods
export const setDeviceId = (deviceId) => {
  try {
    if (!deviceId) {
      throw new Error('Device ID cannot be empty');
    }
    storage.set(StorageKeys.DeviceId, deviceId);
    console.log('Device ID stored successfully');
  } catch (error) {
    console.error('Error setting device ID:', error);
    throw error;
  }
};

export const getDeviceId = () => {
  try {
    const deviceId = storage.getString(StorageKeys.DeviceId);
    return deviceId || null;
  } catch (error) {
    console.error('Error retrieving device ID:', error);
    return null;
  }
};

// BiometricType methods
export const setBiometricType = (type) => {
  try {
    if (!type) {
      throw new Error('Biometric type cannot be empty');
    }
    storage.set(StorageKeys.BiometricType, JSON.stringify(type));
    console.log('Biometric type updated:', type);
  } catch (error) {
    console.error('Error setting biometric type:', error);
    throw error;
  }
};

export const getBiometricType = () => {
  try {
    const type = storage.getString(StorageKeys.BiometricType);
    return type ? JSON.parse(type) : null;
  } catch (error) {
    console.error('Error retrieving biometric type:', error);
    return null;
  }
};

// BiometricsEnabled methods (updated with additional validation)
export const setBiometricsEnabled = (isEnabled) => {
  try {
    if (typeof isEnabled !== 'boolean') {
      throw new Error('isEnabled must be a boolean value');
    }
    storage.set(StorageKeys.BiometricsEnabled, isEnabled ? "true" : "false");
    console.log(`Biometric enabled status set to ${isEnabled}`);
  } catch (error) {
    console.error("Error setting biometric enabled status:", error);
    throw error;
  }
};

export const getBiometricsEnabled = () => {
  try {
    return storage.getString(StorageKeys.BiometricsEnabled) === "true";
  } catch (error) {
    console.error("Error retrieving biometric enabled status:", error);
    return false;
  }
};

// Utility method to clear all biometric data
export const clearBiometricData = () => {
  try {
    storage.delete(StorageKeys.BiometricPublicKey);
    storage.delete(StorageKeys.BiometricStatus);
    storage.delete(StorageKeys.DeviceId);
    storage.delete(StorageKeys.BiometricType);
    storage.delete(StorageKeys.BiometricsEnabled);
    console.log('All biometric data cleared successfully');
  } catch (error) {
    console.error('Error clearing biometric data:', error);
    throw error;
  }
};

// Utility method to check if all required biometric data is present
export const isAllBiometricDataPresent = () => {
  try {
    const publicKey = getBiometricPublicKey();
    const status = getBiometricStatus();
    const deviceId = getDeviceId();
    const type = getBiometricType();
    const enabled = getBiometricsEnabled();

    return Boolean(
      publicKey && 
      status && 
      deviceId && 
      type && 
      enabled
    );
  } catch (error) {
    console.error('Error checking biometric data:', error);
    return false;
  }
};

// Utility method to get all biometric data
export const getAllBiometricData = () => {
  try {
    return {
      publicKey: getBiometricPublicKey(),
      status: getBiometricStatus(),
      deviceId: getDeviceId(),
      type: getBiometricType(),
      enabled: getBiometricsEnabled()
    };
  } catch (error) {
    console.error('Error retrieving all biometric data:', error);
    return null;
  }
};