import React, { useState, useEffect } from "react";
import { View, Linking, StyleSheet } from "react-native";
import CustomTabView from "./CustomTabView";
import MyAccountTab from "./MyAccountTab";
import OtherAccountTab from "./OtherAccountTab";
import { handleDeepLink } from "./deepLinkHandler";

const StripeAddMoneyScreen = () => {
  const [selectedTab, setSelectedTab] = useState("myAccount");

  useEffect(() => {
    const linkSubscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      linkSubscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <CustomTabView
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab === "myAccount" ? <MyAccountTab /> : <OtherAccountTab />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});

export default StripeAddMoneyScreen;
