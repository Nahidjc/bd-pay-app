import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomTabView = ({ selectedTab, setSelectedTab }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === "myAccount" ? styles.activeTab : null,
        ]}
        onPress={() => setSelectedTab("myAccount")}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === "myAccount" ? styles.activeTabText : null,
          ]}
        >
          My Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === "otherAccount" ? styles.activeTab : null,
        ]}
        onPress={() => setSelectedTab("otherAccount")}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === "otherAccount" ? styles.activeTabText : null,
          ]}
        >
          Other Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#E91E63", // Customize active color
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  activeTabText: {
    color: "#E91E63", // Customize active text color
  },
});

export default CustomTabView;
