import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import {
  Edit2,
  QrCode,
  User,
  CreditCard,
  Info,
  Users,
  ArrowRight,
  Fingerprint,
  X,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProfileState,
  updateUserProfile,
} from "../../state/reducers/authSlice";
import LoadingScreen from "../../components/Loader/Loader";
import {
  checkBiometricSupport,
  disableBiometrics,
  enableBiometrics,
  isBiometricsEnabled,
} from "../../utilities/biometrics/BiometricsUtils";

const defaultAvatar = require("../../assets/avatar.png");
const { width, height } = Dimensions.get("window");

const BiometricModal = ({
  visible,
  onClose,
  onConfirm,
  isEnabling = false,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X color="#888" size={24} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>
          {isEnabling ? "Enable" : "Disable"} Touch/Face ID
        </Text>
        <Fingerprint color="#E91E63" size={50} />
        <Text style={styles.modalText}>
          {isEnabling
            ? "Enable Touch/Face ID to use biometric login. Do you want to enable it?"
            : "By disabling Touch/Face ID, you can log in with PIN only. Do you want to disable?"}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isEnabling ? "#4CAF50" : "#ff4081" },
            ]}
            onPress={onConfirm}
          >
            <Text style={styles.buttonText}>
              Yes, {isEnabling ? "Enable" : "Disable"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>No, Thanks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const ProfileItem = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.profileItem} onPress={onPress}>
    {icon}
    <View style={styles.profileItemText}>
      <Text style={styles.profileItemTitle}>{title}</Text>
      {subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
    </View>
    <ArrowRight color="#E91E63" size={width * 0.06} />
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, token, updateError, updateSuccess, isUpdating } = useSelector(
    (state) => state.auth
  );
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    isEnabling: false,
  });
  const [biometricStatus, setBiometricStatus] = useState({
    isAvailable: false,
    isEnabled: false,
  });
  const [profileImage, setProfileImage] = useState(user.profilePic || null);

  const initializeBiometrics = useCallback(async () => {
    try {
      const { isAvailable } = await checkBiometricSupport();
      const { isEnabled } = await isBiometricsEnabled();

      setBiometricStatus({
        isAvailable: isAvailable,
        isEnabled: isEnabled,
      });
    } catch (error) {
      console.error("Error initializing biometrics:", error);
    }
  }, []);

  useEffect(() => {
    initializeBiometrics();
    return () => dispatch(clearProfileState());
  }, [dispatch, initializeBiometrics]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(clearProfileState());
    }
    if (updateError) {
      Alert.alert("Error", updateError);
      dispatch(clearProfileState());
    }
  }, [updateSuccess, updateError, dispatch]);

  const handleImageUpdate = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Permission to access gallery is needed."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const formData = new FormData();
        formData.append("profilePic", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "profile.jpg",
        });
        setProfileImage(result.assets[0].uri);
        dispatch(updateUserProfile({ data: formData, token }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile picture");
    }
  };

  const handleBiometricAction = async () => {
    setIsLoading(true);
    try {
      let response;
      if (modalConfig.isEnabling) {
        response = await enableBiometrics(token, user._id);
      } else {
        response = await disableBiometrics(token);
      }
      if (response?.data?.success) {
        Alert.alert(
          "Success",
          response?.data?.message || "Operation successful",
          [{ text: "OK", style: "default" }]
        );
        setBiometricStatus((prev) => ({
          ...prev,
          isEnabled: modalConfig.isEnabling,
        }));
      } else {
        Alert.alert("Error", response?.data?.message || "Operation failed", [
          { text: "OK", style: "cancel" },
        ]);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        `Failed to ${
          modalConfig.isEnabling ? "enable" : "disable"
        } biometrics. Please try again.`,
        [{ text: "OK", style: "cancel" }]
      );
    } finally {
      setIsLoading(false);
      setModalConfig((prev) => ({ ...prev, visible: false }));
    }
  };

  const toggleBiometricModal = (isEnabling) => {
    setModalConfig({ visible: true, isEnabling });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

  const PROFILE_IMAGE_SIZE = width * 0.28;

  return (
    <SafeAreaView style={styles.container}>
      <LoadingScreen visible={isUpdating || isLoading} />
      <ScrollView style={styles.content}>
        <View style={styles.profileImageContainer}>
          <View
            style={[
              styles.imageWrapper,
              { width: PROFILE_IMAGE_SIZE, height: PROFILE_IMAGE_SIZE },
            ]}
          >
            <Image
              source={profileImage ? { uri: profileImage } : defaultAvatar}
              style={[
                styles.profileImage,
                { width: PROFILE_IMAGE_SIZE, height: PROFILE_IMAGE_SIZE },
              ]}
            />
            <TouchableOpacity
              style={[styles.editImageButton, { padding: width * 0.02 }]}
              onPress={handleImageUpdate}
            >
              <Edit2 color="white" size={width * 0.035} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.nameText}>{user.fullName}</Text>

        <View style={styles.profileItems}>
          <ProfileItem
            icon={<Edit2 color="#E91E63" size={width * 0.05} />}
            title="Change Profile Info"
            onPress={() => navigation.navigate("ChangeName")}
          />
          <ProfileItem
            icon={<QrCode color="#E91E63" size={width * 0.05} />}
            title="My QR"
            onPress={() => navigation.navigate("QRCode")}
          />
          <ProfileItem
            icon={<User color="#E91E63" size={width * 0.05} />}
            title="BD Pay Number"
            subtitle={user.accountNumber}
          />
          <ProfileItem
            icon={<CreditCard color="#E91E63" size={width * 0.05} />}
            title="Saved cards"
            onPress={() => navigation.navigate("SavedCards")}
          />
          <ProfileItem
            icon={<Info color="#E91E63" size={width * 0.05} />}
            title="Information Update"
            onPress={() => navigation.navigate("Information")}
          />
          <ProfileItem
            icon={<Users color="#E91E63" size={width * 0.05} />}
            title="Nominee Update"
            onPress={() => navigation.navigate("Nominee")}
          />

          {biometricStatus.isAvailable && (
            <ProfileItem
              icon={<Fingerprint color="#E91E63" size={width * 0.05} />}
              title={`${
                biometricStatus.isEnabled ? "Disable" : "Enable"
              } Touch/Face ID`}
              onPress={() => toggleBiometricModal(!biometricStatus.isEnabled)}
            />
          )}
        </View>

        <BiometricModal
          visible={modalConfig.visible}
          onClose={closeModal}
          onConfirm={handleBiometricAction}
          isEnabling={modalConfig.isEnabling}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: "center",
    marginTop: height * 0.05,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    borderRadius: 100,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#E91E63",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  nameText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  profileItems: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: height * 0.015,
    marginHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
    elevation: 3,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  profileItemText: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  profileItemTitle: {
    fontSize: width * 0.04,
    color: "#333",
  },
  profileItemSubtitle: {
    fontSize: width * 0.04,
    color: "#757575",
    marginTop: height * 0.005,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
  },
  modalText: {
    textAlign: "center",
    marginVertical: 15,
    fontSize: 16,
    color: "#666",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#757575",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ProfileScreen;
