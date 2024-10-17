import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  Edit2,
  QrCode,
  User,
  CreditCard,
  Info,
  Users,
  ArrowRight,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
const defaultAvatar = require("../../assets/avatar.png");

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("Nirob");
  const [bKashNumber, setBKashNumber] = useState("+8801311164248");

  const handleImageUpdate = async () => {
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
      setProfileImage(pickerResult.assets[0].uri);
      console.log("Image updated:", pickerResult.assets[0].uri);
    }
  };

  const ProfileItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      {icon}
      <View style={styles.profileItemText}>
        <Text style={styles.profileItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
      </View>
      <ArrowRight color="#E91E63" size={28} />
    </TouchableOpacity>
  );

  const PROFILE_IMAGE_SIZE = width * 0.28;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.profileImageContainer}>
          <View
            style={[
              styles.imageWrapper,
              { width: PROFILE_IMAGE_SIZE, height: PROFILE_IMAGE_SIZE },
            ]}
          >
            <Image
              source={profileImage ? { uri: profileImage } : defaultAvatar} // Use default avatar if no profile image
              style={[
                styles.profileImage,
                { width: PROFILE_IMAGE_SIZE, height: PROFILE_IMAGE_SIZE },
              ]}
            />
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={handleImageUpdate}
            >
              <Edit2 color="white" size={14} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.nameText}>{name}</Text>
        <View style={styles.profileItems}>
          <ProfileItem
            icon={<Edit2 color="#E91E63" size={28} />}
            title="Change Name"
            onPress={() => console.log("Change Name")}
          />
          <ProfileItem
            icon={<QrCode color="#E91E63" size={28} />}
            title="My QR"
            onPress={() => console.log("My QR")}
          />
          <ProfileItem
            icon={<User color="#E91E63" size={28} />}
            title="Update bKash Number"
            subtitle={bKashNumber}
            onPress={() => console.log("Update bKash Number")}
          />
          <ProfileItem
            icon={<CreditCard color="#E91E63" size={28} />}
            title="Saved cards"
            onPress={() => console.log("Saved cards")}
          />
          <ProfileItem
            icon={<Info color="#E91E63" size={28} />}
            title="Information Update"
            onPress={() => console.log("Information Update")}
          />
          <ProfileItem
            icon={<Users color="#E91E63" size={28} />}
            title="Nominee Update"
            onPress={() => console.log("Nominee Update")}
          />
        </View>
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
    marginTop: 40,
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
    padding: 8,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  profileItems: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    elevation: 3,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  profileItemText: {
    flex: 1,
    marginLeft: 18,
  },
  profileItemTitle: {
    fontSize: 18,
    color: "#333",
  },
  profileItemSubtitle: {
    fontSize: 16,
    color: "#757575",
    marginTop: 4,
  },
});

export default ProfileScreen;
