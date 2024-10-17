import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { ArrowRight, Edit2, Image, User } from "lucide-react-native";

const SettingsScreen = () => {
  const SettingItem = ({ icon, title }) => (
    <TouchableOpacity style={styles.settingItem}>
      {icon}
      <Text style={styles.settingText}>{title}</Text>
      <ArrowRight color="#E91E63" size={24} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SettingItem
          icon={<Edit2 color="#E91E63" size={24} />}
          title="Change Name"
        />
        <SettingItem
          icon={<Image color="#E91E63" size={24} />}
          title="Change Picture"
        />
        <SettingItem
          icon={<User color="#E91E63" size={24} />}
          title="Manage Account"
        />
      </View>
      <Text style={styles.version}>Version: 6.2.0</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  settingText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: "#E91E63",
  },
  version: {
    textAlign: "center",
    padding: 16,
    color: "#757575",
  },
});

export default SettingsScreen;
