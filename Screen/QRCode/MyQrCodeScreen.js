import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  SafeAreaView,
  Dimensions, // Import Dimensions
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import RNFS from "react-native-fs";
import * as MediaLibrary from "expo-media-library";
import Share from "react-native-share";
import { PERMISSIONS, request } from "react-native-permissions";
import { Download, Share as ShareIcon } from "lucide-react-native";

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const MyQrCodeScreen = ({ navigation }) => {
  const svgRef = useRef(null);
  const accountNumber = "01910125428";

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await request(
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Storage permission is required to save QR code."
          );
          return false;
        }
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Media library access is required to save QR code."
        );
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const saveQRCodeToGallery = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    try {
      const base64Data = await new Promise((resolve, reject) => {
        svgRef.current.toDataURL((data) => {
          resolve(data);
        });
      });
      const filePath = `${RNFS.CachesDirectoryPath}/qrcode.png`;
      await RNFS.writeFile(filePath, base64Data, "base64");
      const asset = await MediaLibrary.createAssetAsync(`file://${filePath}`);
      const album = await MediaLibrary.getAlbumAsync("QR Codes");
      if (album === null) {
        await MediaLibrary.createAlbumAsync("QR Codes", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert("Success", "QR code has been saved to your gallery!");

      await RNFS.unlink(filePath);
    } catch (error) {
      Alert.alert("Error", "Could not save QR code.");
    }
  };

  const shareQRCode = async () => {
    try {
      const base64Data = await new Promise((resolve) => {
        svgRef.current.toDataURL((data) => {
          resolve(data);
        });
      });

      const filePath = `${RNFS.CachesDirectoryPath}/qrcode.png`;
      await RNFS.writeFile(filePath, base64Data, "base64");

      await Share.open({
        url: `file://${filePath}`,
        type: "image/png",
        title: "Share QR Code",
      });
      await RNFS.unlink(filePath);
    } catch (error) {
      Alert.alert("Error", "Could not share QR code.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.qrFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />

          <QRCode
            value={accountNumber}
            size={SCREEN_WIDTH * 0.63}
            color="#E91E63"
            backgroundColor="white"
            logo={require("../../assets/logo_bkash.png")}
            logoSize={SCREEN_WIDTH * 0.15}
            logoBackgroundColor="white"
            getRef={(c) => (svgRef.current = c)}
          />
        </View>

        <Text style={styles.shareText}>Share QR code</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={saveQRCodeToGallery}>
            <Download color="#E91E63" size={20} />
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={shareQRCode}>
            <ShareIcon color="#E91E63" size={20} />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.05,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  qrFrame: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SCREEN_HEIGHT * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.05,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 8,
    position: "relative",
  },
  cornerTL: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.02,
    left: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: "#E91E63",
  },
  cornerTR: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.02,
    right: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: "#E91E63",
  },
  cornerBL: {
    position: "absolute",
    bottom: SCREEN_HEIGHT * 0.02,
    left: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: "#E91E63",
  },
  cornerBR: {
    position: "absolute",
    bottom: SCREEN_HEIGHT * 0.02,
    right: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: "#E91E63",
  },
  shareText: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: "#333",
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#E91E63",
    borderWidth: 1,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    margin: SCREEN_WIDTH * 0.03,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  buttonText: {
    color: "#E91E63",
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: SCREEN_WIDTH * 0.02,
  },
});

export default MyQrCodeScreen;
