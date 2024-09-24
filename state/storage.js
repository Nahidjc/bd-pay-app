import { MMKV } from "react-native-mmkv";
import * as Application from "expo-application";

export const StorageKeys = {
  User: "user",
  IsAuthenticated: "isAuthenticated",
  Language: "language",
  Onboarding: "onboarded",
};

// Initialize MMKV
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
  try {
    return storage.getString(StorageKeys.IsAuthenticated) === "true";
  } catch (e) {
    console.error("Error checking authentication status:", e);
    return false;
  }
};

export const clearUserData = () => {
  try {
    storage.delete(StorageKeys.User);
    storage.delete(StorageKeys.IsAuthenticated);
    console.log("User data and authentication status cleared");
  } catch (e) {
    console.error("Error clearing user data:", e);
  }
};
