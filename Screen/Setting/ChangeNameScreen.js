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

const { width } = Dimensions.get("window");

const ChangeNameScreen = ({ route }) => {
  const originalFirstName = route.params?.firstName || "Nirob";
  const originalLastName = route.params?.lastName || "";

  const [firstName, setFirstName] = useState(originalFirstName);
  const [lastName, setLastName] = useState(originalLastName);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleUpdate = () => {
    console.log("Updating name:", firstName, lastName);
  };

  const onChangeFirstName = (value) => {
    setFirstName(value);
    setIsUpdated(value !== originalFirstName || lastName !== originalLastName);
  };

  const onChangeLastName = (value) => {
    setLastName(value);
    setIsUpdated(firstName !== originalFirstName || value !== originalLastName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Text style={styles.infoText}>
            Your name will appear on your BD Pay App home screen. Only you can
            see this.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={onChangeFirstName}
              placeholder="Enter your first name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={onChangeLastName}
              placeholder="Enter your last name"
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
