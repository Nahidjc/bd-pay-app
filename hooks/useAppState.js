import { showMessage } from "react-native-flash-message";
import { useEffect, useRef, useCallback } from "react";
import { AppState, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../state/reducers/authSlice";

const BACKGROUND_TIMEOUT = 40000;
const INACTIVITY_TIMEOUT = 40000;

export const useAppState = () => {
  const dispatch = useDispatch();
  const appStateRef = useRef(AppState.currentState);
  const backgroundTimeoutRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);
  const isLoggedOut = useRef(false);
  const lastActiveTimestamp = useRef(Date.now());

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

  const handleLogout = useCallback(
    async (reason = "inactivity") => {
      try {
        if (isLoggedOut.current) return;

        const timeSinceLastActive = Date.now() - lastActiveTimestamp.current;
        if (
          timeSinceLastActive <
          (reason === "background" ? BACKGROUND_TIMEOUT : INACTIVITY_TIMEOUT)
        ) {
          return;
        }

        console.log(
          `Logging out due to ${reason}. Time since last active:`,
          timeSinceLastActive
        );
        isLoggedOut.current = true;
        clearTimeouts();

        await dispatch(logout());

        showMessage({
          message: `Session expired due to ${reason}.`,
          description:
            "You have been logged out for security reasons. Please log in again to continue.",
          type: "warning",
          icon: "warning",
          duration: 4000,
          floating: true,
          statusBarHeight: Platform.OS === "ios" ? 20 : 0,
        });
      } catch (error) {
        console.error("Logout error:", error);
        isLoggedOut.current = false;
      }
    },
    [dispatch, clearTimeouts]
  );

  const checkInactivity = useCallback(() => {
    const currentTime = Date.now();
    const timeSinceLastActive = currentTime - lastActiveTimestamp.current;

    if (timeSinceLastActive >= INACTIVITY_TIMEOUT) {
      handleLogout("inactivity");
    } else {
      // Schedule next check
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      inactivityTimeoutRef.current = setTimeout(
        checkInactivity,
        INACTIVITY_TIMEOUT - timeSinceLastActive
      );
    }
  }, [handleLogout]);

  const resetInactivityTimeout = useCallback(() => {
    if (isLoggedOut.current) return;

    lastActiveTimestamp.current = Date.now();
    console.log(
      "Activity detected, resetting timer:",
      new Date(lastActiveTimestamp.current).toISOString()
    );

    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(
      checkInactivity,
      INACTIVITY_TIMEOUT
    );
  }, [checkInactivity]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      console.log(
        "App State Changed:",
        appStateRef.current,
        "=>",
        nextAppState
      );

      if (
        appStateRef.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log("App going to background, starting background timer");
        if (backgroundTimeoutRef.current) {
          clearTimeout(backgroundTimeoutRef.current);
        }
        backgroundTimeoutRef.current = setTimeout(
          () => handleLogout("background"),
          BACKGROUND_TIMEOUT
        );
      } else if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App coming to foreground");
        clearTimeouts();
        if (!isLoggedOut.current) {
          resetInactivityTimeout();
        }
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Initial setup
    resetInactivityTimeout();

    // Check if app started in background
    if (appStateRef.current.match(/inactive|background/)) {
      backgroundTimeoutRef.current = setTimeout(
        () => handleLogout("background"),
        BACKGROUND_TIMEOUT
      );
    }

    return () => {
      subscription.remove();
      clearTimeouts();
    };
  }, [handleLogout, resetInactivityTimeout, clearTimeouts]);

  return resetInactivityTimeout;
};
