import { showMessage } from "react-native-flash-message";
import { useEffect, useRef, useCallback } from "react";
import { AppState } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../state/reducers/authSlice";

const BACKGROUND_TIMEOUT = 60000;
const INACTIVITY_TIMEOUT = 60000;

export const useAppState = () => {
  const dispatch = useDispatch();
  const appStateRef = useRef(AppState.currentState);
  const backgroundTimeoutRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);
  const isLoggedOut = useRef(false);

  const clearTimeouts = useCallback(() => {
    if (backgroundTimeoutRef.current) {
      clearTimeout(backgroundTimeoutRef.current);
      backgroundTimeoutRef.current = null;
    }
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      if (isLoggedOut.current) return;
      isLoggedOut.current = true;

      await dispatch(logout());

      showMessage({
        message: "Session expired due to inactivity.",
        description:
          "You have been logged out for security reasons. Please log in again to continue.",
        type: "warning",
        icon: "warning",
        duration: 4000,
        floating: true,
        statusBarHeight: 20,
      });
    } catch (error) {
      console.error("Logout error:", error);
      isLoggedOut.current = false;
    }
  }, [dispatch]);

  const resetInactivityTimeout = useCallback(() => {
    if (!isLoggedOut.current) {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      inactivityTimeoutRef.current = setTimeout(
        handleLogout,
        INACTIVITY_TIMEOUT
      );
    }
  }, [handleLogout]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const currentState = appStateRef.current;
      if (
        currentState.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        backgroundTimeoutRef.current = setTimeout(
          handleLogout,
          BACKGROUND_TIMEOUT
        );
      } else if (
        currentState.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        clearTimeouts();
        resetInactivityTimeout();
      }

      appStateRef.current = nextAppState;
    });
    resetInactivityTimeout();
    return () => {
      subscription.remove();
      clearTimeouts();
    };
  }, [handleLogout, resetInactivityTimeout, clearTimeouts]);

  return resetInactivityTimeout;
};
