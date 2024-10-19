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
  Alert,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "./../../state/reducers/authSlice";
import LoadingScreen from "../../components/Loader/Loader";

const { width } = Dimensions.get("window");

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
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
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
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>NID</Text>
            <TextInput
              style={styles.input}
              value={nid}
              onChangeText={onChangeNid}
              placeholder="Enter your NID number"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={onChangeAddress}
              placeholder="Enter your address"
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
            <ArrowRight color="white" size={24} />
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
    padding: 16,
    width: width * 0.9,
    alignSelf: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 34,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 8,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.95,
    alignSelf: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  updateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default ChangeNameScreen;
