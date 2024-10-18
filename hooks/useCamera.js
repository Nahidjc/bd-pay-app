import { useState, useEffect, useCallback } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { Camera } from "react-native-camera";

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = useCallback(async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission to scan QR codes",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      }
    } catch (err) {
      console.warn("Error requesting camera permission:", err);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQRCodeScanned = useCallback(({ data, type }) => {
    const isValidQRCode = validateQRCode(data);
    if (isValidQRCode) {
      return {
        success: true,
        data: JSON.parse(data),
      };
    }
    return {
      success: false,
      error: "Invalid QR Code",
    };
  }, []);

  return {
    hasPermission,
    isLoading,
    handleQRCodeScanned,
    requestCameraPermission,
  };
};

const validateQRCode = (data) => {
  try {
    const parsed = JSON.parse(data);
    return true;
  } catch {
    return false;
  }
};
