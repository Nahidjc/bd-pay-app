import { MMKV } from "react-native-mmkv";
import * as Application from "expo-application";

// Define storage keys
export const StorageKeys = {
  User: "user",
  IsAuthenticated: "isAuthenticated",
  Token: "token",
  Language: "language",
  Onboarding: "onboarded",
  AccountNumber: "accountNumber",
};

const storageId = `${Application.applicationId}-mmkv`;
export const storage = new MMKV({ id: storageId });

export const saveUserData = (user, token, accountNumber) => {
  try {
    storage.set(StorageKeys.User, JSON.stringify(user));
    storage.set(StorageKeys.Token, token);
    storage.set(StorageKeys.AccountNumber, accountNumber);
    storage.set(StorageKeys.IsAuthenticated, "true");
    console.log("User data, token, account number, and authentication status saved");
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
    return  storage.delete(StorageKeys.AccountNumber);
  } catch (e) {
    console.error("Error retrieving account number:", e);
    return null;
  }
};
