import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { RNCamera } from "react-native-camera";
import { useNavigation } from "@react-navigation/native";
import { QrCode } from "lucide-react-native";
import { useCamera } from "./../../hooks/useCamera";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCANNER_SIZE = SCREEN_WIDTH * 0.7;

const ScannerOverlay = () => (
  <View style={styles.overlay}>
    <View style={styles.scannerContainer}>
      <View style={styles.scanner}>
        <View style={[styles.cornerBorder, styles.topLeft]} />
        <View style={[styles.cornerBorder, styles.topRight]} />
        <View style={[styles.cornerBorder, styles.bottomLeft]} />
        <View style={[styles.cornerBorder, styles.bottomRight]} />
      </View>
    </View>
    <View style={styles.instructionContainer}>
      <View style={styles.instructionCard}>
        <QrCode color="#E91E63" size={24} />
        <Text style={styles.instructionText}>
          Scan Agent's QR code for faster Cash Out
        </Text>
      </View>
    </View>
  </View>
);

const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#E91E63" />
    <Text style={styles.loadingText}>Requesting camera permission...</Text>
  </View>
);

const NoPermissionView = ({ onRequestPermission }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorText}>
      Camera permission is required to scan QR codes
    </Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRequestPermission}>
      <Text style={styles.retryButtonText}>Grant Permission</Text>
    </TouchableOpacity>
  </View>
);

const ScanQrCodeScreen = () => {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(true);
  const {
    hasPermission,
    isLoading,
    handleQRCodeScanned,
    requestCameraPermission,
  } = useCamera();

  const onQRCodeScanned = useCallback(
    async (scanResult) => {
      if (!isScanning) return;

      setIsScanning(false);

      const result = await handleQRCodeScanned(scanResult);
      console.log("============result============", result);

      if (result.success) {
        const { route, recipient } = result.data;
        console.log(
          "=============== route, recipient ===============",
          route,
          recipient
        );
        navigation.navigate("CashOutConfirmation", {
          agentData: result.data,
        });
      } else {
        Alert.alert("Invalid QR Code", "Please scan a valid agent QR code", [
          {
            text: "OK",
            onPress: () => setIsScanning(true),
          },
        ]);
      }
    },
    [handleQRCodeScanned, navigation, isScanning]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <NoPermissionView onRequestPermission={requestCameraPermission} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={onQRCodeScanned}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        captureAudio={false}
      >
        <ScannerOverlay />
      </RNCamera>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backButton: {
    padding: 8,
  },
  rightIcon: {
    width: 40,
    height: 40,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  scannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanner: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    backgroundColor: "transparent",
  },
  cornerBorder: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#E91E63",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: SCREEN_WIDTH - 32,
  },
  instructionText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#E91E63",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ScanQrCodeScreen;
