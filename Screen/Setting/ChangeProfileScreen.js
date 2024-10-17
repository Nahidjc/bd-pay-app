import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { ArrowLeft, Edit2, ArrowRight } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const defaultAvatar = require("../../assets/avatar.png");

const { width, height } = Dimensions.get("window"); // Get the screen dimensions

const ChangePictureScreen = ({ navigation, route }) => {
  const initialProfileImage = route.params?.profileImage || defaultAvatar;
  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const [isChanged, setIsChanged] = useState(false);

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfileImage({ uri: pickerResult.assets[0].uri });
      setIsChanged(pickerResult.assets[0].uri !== initialProfileImage.uri);
    }
  };

  const handleSave = () => {
    if (!isChanged) return;
    console.log("Saving new profile picture:", profileImage);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Tap on the Edit icon below to take a photo or upload your picture
        </Text>

        <View style={styles.imageContainer}>
          <Image source={profileImage} style={styles.profileImage} />
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
