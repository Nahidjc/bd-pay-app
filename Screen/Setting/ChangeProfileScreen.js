import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import { ArrowLeft, Edit2, ArrowRight } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "./../../state/reducers/authSlice";

const defaultAvatar = require("../../assets/avatar.png");

const { width, height } = Dimensions.get("window");

const ChangePictureScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { profilePic } = user;
  const [profileImage, setProfileImage] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (profilePic) {
      setProfileImage({ uri: profilePic });
    }
  }, [profilePic]);

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "Permission to access camera roll is required!"
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const newImage = { uri: pickerResult.assets[0].uri };
      setProfileImage(newImage);
      setIsChanged(true);
    }
  };

  const handleSave = async () => {
    if (!isChanged || !profileImage) return;

    const formData = new FormData();
    formData.append("profilePic", {
      uri: profileImage.uri,
      type: "image/jpeg",
      name: "profile.jpg",
    });

    try {
      await dispatch(updateUserProfile({ data: formData, token })).unwrap();
      Alert.alert("Success", "Profile picture updated successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile picture");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Tap on the Edit icon below to take a photo or upload your picture
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={profileImage || defaultAvatar}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleImagePicker}
          >
            <Edit2 color="white" size={15} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          isChanged ? styles.saveButtonActive : styles.saveButtonDisabled,
        ]}
        onPress={handleSave}
        disabled={!isChanged}
      >
        <Text style={styles.saveButtonText}>Save</Text>
        <ArrowRight color="white" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    alignItems: "center",
    padding: 16,
  },
  instructionText: {
    fontSize: width * 0.04,
    color: "#333",
    textAlign: "center",
    marginBottom: 32,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 40,
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.4) / 2,
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#E91E63",
    borderRadius: 20,
    padding: 10,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  saveButtonActive: {
    backgroundColor: "#E91E63",
  },
  saveButtonDisabled: {
    backgroundColor: "#757575",
  },
  saveButtonText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default ChangePictureScreen;
