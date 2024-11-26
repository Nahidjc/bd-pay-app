import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "./../../state/reducers/authSlice";
import LoadingScreen from "../../components/Loader/Loader";
import { showMessage } from "react-native-flash-message";

const { width, height } = Dimensions.get("window");

const scale = width / 375;
const verticalScale = height / 812;
const s = (size) => size * scale;
const vs = (size) => size * verticalScale;
const ms = (size, factor = 0.5) => size + (s(size) - size) * factor;

const ChangeNameScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { token, user, isUpdating } = useSelector((state) => state.auth);
  const {
    fullName: originalFullName,
    Nid: originalNid,
    address: originalAddress,
  } = user;

  const [fullName, setFullName] = useState(originalFullName || "");
  const [nid, setNid] = useState(originalNid || "");
  const [address, setAddress] = useState(originalAddress || "");
  const [isUpdated, setIsUpdated] = useState(false);

  const handleUpdate = async () => {
    if (!isUpdated) return;

    const updatedData = {
      fullName,
      Nid: nid,
      address,
    };

    try {
      await dispatch(updateUserProfile({ data: updatedData, token })).unwrap();
      showMessage({
        message: "Success",
        description: "Profile updated successfully!",
        type: "success",
        duration: 3000,
        icon: "success",
      });
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: "Error",
        description: error.message || "Failed to update profile",
        type: "danger",
        duration: 3000,
        icon: "danger",
      });
    }
  };

  const checkIfUpdated = (newFullName, newNid, newAddress) => {
    return (
      newFullName !== originalFullName ||
      newNid !== originalNid ||
      newAddress !== originalAddress
    );
  };

  const onChangeFullName = (value) => {
    setFullName(value);
    setIsUpdated(checkIfUpdated(value, nid, address));
  };

  const onChangeNid = (value) => {
    setNid(value);
    setIsUpdated(checkIfUpdated(fullName, value, address));
  };

  const onChangeAddress = (value) => {
    setAddress(value);
    setIsUpdated(checkIfUpdated(fullName, nid, value));
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingScreen visible={isUpdating} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Text style={styles.infoText}>
            Update your profile information below.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={onChangeFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>NID</Text>
            <TextInput
              style={styles.input}
              value={nid}
              onChangeText={onChangeNid}
              placeholder="Enter your NID number"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={address}
              onChangeText={onChangeAddress}
              placeholder="Enter your address"
              placeholderTextColor="#999"
              multiline
            />
          </View>

          <TouchableOpacity
            style={[
              styles.updateButton,
              { backgroundColor: isUpdated ? "#E91E63" : "#ccc" },
            ]}
            onPress={handleUpdate}
            disabled={!isUpdated}
          >
            <Text style={styles.updateButtonText}>Update</Text>
            <ArrowRight color="white" size={s(24)} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: s(16),
    width: width * 0.9,
    alignSelf: "center",
  },
  infoText: {
    fontSize: ms(16),
    color: "#333",
    marginBottom: vs(34),
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: vs(24),
  },
  label: {
    fontSize: ms(16),
    color: "#666",
    marginBottom: vs(8),
    fontWeight: "500",
  },
  input: {
    fontSize: ms(18),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: vs(8),
    color: "#333",
  },
  multilineInput: {
    minHeight: vs(60),
    textAlignVertical: "top",
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9,
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    borderRadius: s(8),
    marginTop: vs(24),
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  updateButtonText: {
    color: "white",
    fontSize: ms(18),
    fontWeight: "bold",
    marginRight: s(8),
  },
  arrowIcon: {
    marginLeft: s(8),
  },
});

export default ChangeNameScreen;
