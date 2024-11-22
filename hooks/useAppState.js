import { showMessage } from "react-native-flash-message";
import { useEffect, useRef, useCallback } from "react";
import { AppState, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../state/reducers/authSlice";

// Configuration
const CONFIG = {
  BACKGROUND_TIMEOUT: 60000,
  INACTIVITY_TIMEOUT: 60000,
  DEBUG: __DEV__,
};

// Debug logger utility with timestamp
const debugLog = (message, data = {}) => {
  if (CONFIG.DEBUG) {
    const timestamp = new Date().toISOString();
    console.log(`[AppState Debug ${timestamp}] ${message}`, {
      ...data,
      timestamp,
    });
  }
};

export const useAppState = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const appStateRef = useRef(AppState.currentState);
  const backgroundTimeoutRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);
  const isLoggedOut = useRef(false);
  const lastActiveTimestamp = useRef(Date.now());
  const backgroundStartTime = useRef(null);

  const clearTimeouts = useCallback(() => {
    debugLog("Clearing timeouts", {
      hadBackgroundTimeout: !!backgroundTimeoutRef.current,
      hadInactivityTimeout: !!inactivityTimeoutRef.current,
    });

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
        if (!token) {
          debugLog("Logout skipped - no auth token present");
          return;
        }

        if (isLoggedOut.current) {
          await dispatch(logout());
          showMessage({
            message: `Session expired due to ${reason}`,
            description:
              "You have been logged out for security reasons. Please log in again to continue.",
            type: "warning",
            icon: "warning",
            duration: 4000,
            floating: true,
            statusBarHeight: Platform.OS === "ios" ? 20 : 0,
          });
          debugLog("Logout skipped - already logged out");
          return;
        }

        const currentTime = Date.now();
        let timeSinceLastActive;

        if (reason === "background" && backgroundStartTime.current) {
          timeSinceLastActive = currentTime - backgroundStartTime.current;
          debugLog("Background duration check", {
            backgroundStartTime: new Date(
              backgroundStartTime.current
            ).toISOString(),
            currentTime: new Date(currentTime).toISOString(),
            duration: timeSinceLastActive,
            threshold: CONFIG.BACKGROUND_TIMEOUT,
          });
        } else {
          timeSinceLastActive = currentTime - lastActiveTimestamp.current;
        }

        const timeoutThreshold =
          reason === "background"
            ? CONFIG.BACKGROUND_TIMEOUT
            : CONFIG.INACTIVITY_TIMEOUT;

        if (timeSinceLastActive < timeoutThreshold) {
          debugLog("Logout skipped - within threshold", {
            reason,
            timeSinceLastActive,
            timeoutThreshold,
          });
          return;
        }

        debugLog("Executing logout", {
          reason,
          timeSinceLastActive,
          threshold: timeoutThreshold,
        });

        isLoggedOut.current = true;
        clearTimeouts();

        await dispatch(logout());

        showMessage({
          message: `Session expired due to ${reason}`,
          description:
            "You have been logged out for security reasons. Please log in again to continue.",
          type: "warning",
          icon: "warning",
          duration: 4000,
          floating: true,
          statusBarHeight: Platform.OS === "ios" ? 20 : 0,
        });
      } catch (error) {
        debugLog("Logout error", { error: error.message });
        console.error("Logout error:", error);
        isLoggedOut.current = false;
      }
    },
    [dispatch, clearTimeouts, token]
  );

  const handleBackgroundState = useCallback(() => {
    if (!token) {
      debugLog("Background timer skipped - no auth token present");
      return;
    }

    backgroundStartTime.current = Date.now();

    debugLog("Starting background timer", {
      startTime: new Date(backgroundStartTime.current).toISOString(),
      timeout: CONFIG.BACKGROUND_TIMEOUT,
    });

    // Clear any existing background timeout
    if (backgroundTimeoutRef.current) {
      clearTimeout(backgroundTimeoutRef.current);
    }

    // Set new background timeout
    backgroundTimeoutRef.current = setTimeout(() => {
      debugLog("Background timeout triggered", {
        startTime: new Date(backgroundStartTime.current).toISOString(),
        currentTime: new Date().toISOString(),
        duration: Date.now() - backgroundStartTime.current,
      });
      handleLogout("background");
    }, CONFIG.BACKGROUND_TIMEOUT);
  }, [handleLogout, token]);

  const checkInactivity = useCallback(() => {
    if (!token) return;

    const currentTime = Date.now();
    const timeSinceLastActive = currentTime - lastActiveTimestamp.current;

    debugLog("Checking inactivity", {
      timeSinceLastActive,
      threshold: CONFIG.INACTIVITY_TIMEOUT,
    });

    if (timeSinceLastActive >= CONFIG.INACTIVITY_TIMEOUT) {
      handleLogout("inactivity");
    } else {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      inactivityTimeoutRef.current = setTimeout(
        checkInactivity,
        CONFIG.INACTIVITY_TIMEOUT - timeSinceLastActive
      );
    }
  }, [handleLogout, token]);

  const resetInactivityTimeout = useCallback(() => {
    if (!token || isLoggedOut.current) return;

    lastActiveTimestamp.current = Date.now();

    debugLog("Resetting inactivity timer", {
      lastActiveTimestamp: new Date(lastActiveTimestamp.current).toISOString(),
    });

    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(
      checkInactivity,
      CONFIG.INACTIVITY_TIMEOUT
    );
  }, [checkInactivity, token]);

  useEffect(() => {
    if (!token) {
      debugLog("Cleaning up - no token present");
      clearTimeouts();
      return;
    }

    const handleAppStateChange = (nextAppState) => {
      debugLog("App state changing", {
        from: appStateRef.current,
        to: nextAppState,
        isLoggedOut: isLoggedOut.current,
      });

      if (
        appStateRef.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        handleBackgroundState();
      } else if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        debugLog("App returning to foreground", {
          backgroundDuration: backgroundStartTime.current
            ? Date.now() - backgroundStartTime.current
            : null,
        });

        const timeInBackground = backgroundStartTime.current
          ? Date.now() - backgroundStartTime.current
          : 0;

        clearTimeouts();

        // Check if we should logout due to background duration
        if (timeInBackground >= CONFIG.BACKGROUND_TIMEOUT) {
          debugLog("Background duration exceeded on return", {
            duration: timeInBackground,
            threshold: CONFIG.BACKGROUND_TIMEOUT,
          });
          handleLogout("background");
        } else if (!isLoggedOut.current) {
          resetInactivityTimeout();
        }

        backgroundStartTime.current = null;
      }

      appStateRef.current = nextAppState;
    };

    debugLog("Initializing AppState hook");

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    resetInactivityTimeout();

    // Check if app started in background
    if (appStateRef.current.match(/inactive|background/)) {
      handleBackgroundState();
    }

    return () => {
      debugLog("Cleaning up AppState hook");
      subscription.remove();
      clearTimeouts();
    };
  }, [
    handleLogout,
    resetInactivityTimeout,
    clearTimeouts,
    handleBackgroundState,
    token,
  ]);

  return resetInactivityTimeout;
};
