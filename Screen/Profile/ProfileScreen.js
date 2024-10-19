import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  clearProfileState,
  updateUserProfile,
} from "../../state/reducers/authSlice";
const defaultAvatar = require("../../assets/avatar.png");

const { width, height } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, token, updateError, updateSuccess } = useSelector(
    (state) => state.auth
  );
  const { fullName, profilePic, accountNumber } = user;
  const [profileImage, setProfileImage] = useState(profilePic || null);
  useEffect(() => {
    return () => {
      dispatch(clearProfileState());
    };
  }, [dispatch]);
  useEffect(() => {
    if (updateSuccess) {
      Alert.alert("Success", "Profile updated successfully");
      dispatch(clearProfileState());
    }
    if (updateError) {
      Alert.alert("Error", updateError);
      dispatch(clearProfileState());
    }
  }, [updateSuccess, updateError, dispatch]);

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
      const data = { profilePic: pickerResult.assets[0].uri };
      dispatch(updateUserProfile({ data, token }));
    }
  };

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
        <Text style={styles.nameText}>{fullName}</Text>
        <View style={styles.profileItems}>
          <ProfileItem
            icon={<Edit2 color="#E91E63" size={width * 0.05} />}
            title="Change Name"
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
            subtitle={accountNumber}
            onPress={() => console.log("Update BD Pay Number")}
          />
          <ProfileItem
            icon={<CreditCard color="#E91E63" size={width * 0.05} />}
            title="Saved cards"
            onPress={() => console.log("Saved cards")}
          />
          <ProfileItem
            icon={<Info color="#E91E63" size={width * 0.05} />}
            title="Information Update"
            onPress={() => console.log("Information Update")}
          />
          <ProfileItem
            icon={<Users color="#E91E63" size={width * 0.05} />}
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
});

export default ProfileScreen;
