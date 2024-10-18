import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import RNFS from "react-native-fs";
import * as MediaLibrary from "expo-media-library";
import Share from "react-native-share";
import { PERMISSIONS, request } from "react-native-permissions";
import { Download, Share as ShareIcon } from "lucide-react-native";

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

      // For both iOS and Android, request media library permission
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
            size={280}
            color="#E91E63"
            backgroundColor="white"
            logo={require("../../assets/logo_bkash.png")}
            logoSize={50}
            logoBackgroundColor="white"
            getRef={(c) => (svgRef.current = c)}
          />
        </View>

        <Text style={styles.shareText}>Share QR code</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={saveQRCodeToGallery}>
            <Download color="#E91E63" size={24} />
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={shareQRCode}>
            <ShareIcon color="#E91E63" size={24} />
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
  header: {
    backgroundColor: "#E91E63",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingTop: Platform.OS === "android" ? 35 : 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  qrFrame: {
    width: 320,
    height: 320,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 8,
    position: "relative",
  },
  cornerTL: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: "#E91E63",
  },
  cornerTR: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: "#E91E63",
  },
  cornerBL: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: "#E91E63",
  },
  cornerBR: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: "#E91E63",
  },
  shareText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 40,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E91E63",
    backgroundColor: "white",
    gap: 8,
  },
  buttonText: {
    color: "#E91E63",
    fontSize: 1,
    fontWeight: "500",
  },
});

export default MyQrCodeScreen;
