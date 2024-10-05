import { MMKV } from "react-native-mmkv";
import * as Application from "expo-application";

export const StorageKeys = {
  User: "user",
  IsAuthenticated: "isAuthenticated",
  Language: "language",
  Onboarding: "onboarded",
};

const storageId = `${Application.applicationId}-mmkv`;
export const storage = new MMKV({ id: storageId });

export const saveUserData = (user) => {
  try {
    storage.set(StorageKeys.User, JSON.stringify(user));
    storage.set(StorageKeys.IsAuthenticated, "true");
    console.log("User data and authentication status saved");
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
};

// New methods for onboarding status
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
