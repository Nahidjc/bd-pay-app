import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../state/reducers/authSlice";

const BACKGROUND_TIMEOUT = 300000;
const INACTIVITY_TIMEOUT = 60000;

export const useAppState = () => {
  const dispatch = useDispatch();
  const appStateRef = useRef(AppState.currentState);
  const backgroundTimeoutRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);

  const handleLogout = async () => {
    try {
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appStateRef.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        // App is going to background
        backgroundTimeoutRef.current = setTimeout(
          handleLogout,
          BACKGROUND_TIMEOUT
        );
      } else if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App is coming to foreground
        if (backgroundTimeoutRef.current) {
          clearTimeout(backgroundTimeoutRef.current);
        }
        resetInactivityTimeout();
      }
      appStateRef.current = nextAppState;
    });

    resetInactivityTimeout();

    return () => {
      subscription.remove();
      if (backgroundTimeoutRef.current) {
        clearTimeout(backgroundTimeoutRef.current);
      }
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  return resetInactivityTimeout;
};
