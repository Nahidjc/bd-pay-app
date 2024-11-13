import React, { memo, useState, useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const DefaultAvatar = require("../../assets/avatar.png");
const { height, width } = Dimensions.get("window");

const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicWidth = (percentage) => (width * percentage) / 100;
const baseWidth = 375;
const scale = width / baseWidth;

const Header = ({ navigation, route, options, tabName, user }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);
  const [secureImageUrl, setSecureImageUrl] = useState("");
  const backgroundColor =
    StyleSheet.flatten(options.headerStyle)?.backgroundColor ?? theme.white;

  useEffect(() => {
    if (user?.profilePic) {
      setSecureImageUrl(user.profilePic);
    }
  }, [user]);

  const goBack = () => {
    const routes = navigation.getState()?.routes;
    if (routes[routes.length - 2]?.name === "VerificationCode") {
      navigation.pop(2);
    } else {
      navigation.goBack();
    }
  };

  const openMenu = () => {
    navigation.toggleDrawer();
  };

  const handleImageError = () => {
    console.log("Image load error for URL:", secureImageUrl);
    setImageError(true);
  };

  const renderProfileSection = () => (
    <Pressable
      style={styles.profileContainer}
      onPress={() => navigation.navigate("Profile")}
    >
      {imageError || !secureImageUrl ? (
        <Image
          source={DefaultAvatar}
          style={styles.profileImage}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={{ uri: secureImageUrl }}
          style={styles.profileImage}
          resizeMode="cover"
          onError={handleImageError}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>{user?.fullName || t("user")}</Text>
        <Text style={styles.subtitle}>{t("welcome")}</Text>
      </View>
    </Pressable>
  );

  const renderBackButton = () => (
    <View style={{ flex: 1 }}>
      <Pressable style={[styles.button, styles.backButton]} onPress={goBack}>
        <Ionicons
          name="arrow-back"
          size={24 * scale}
          color="#fff"
          style={styles.backIcon}
        />
      </Pressable>
    </View>
  );

  const renderTitle = () => (
    <Text style={styles.title} numberOfLines={1} allowFontScaling={false}>
      {t(options.title || route.name)}
    </Text>
  );

  const renderHeaderRight = () =>
    options.headerRight && (
      <View style={[styles.button, styles.rightButton]}>
        {options.headerRight({ canGoBack: navigation.canGoBack() })}
      </View>
    );

  const renderMenuButton = () => (
    <Pressable onPress={openMenu} style={styles.menuButton}>
      <Ionicons name="menu" size={24 * scale} color="white" />
    </Pressable>
  );

  return (
    <SafeAreaView style={{ backgroundColor }} edges={["top"]}>
      <View style={styles.appBar}>
        {tabName === "Dashboard" && renderProfileSection()}
        {tabName !== "Dashboard" && (
          <>
            {navigation.canGoBack() && renderBackButton()}
            {renderTitle()}
            {renderHeaderRight()}
          </>
        )}
        {(tabName === "Dashboard" || tabName === "Statements") &&
          renderMenuButton()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: dynamicHeight(6),
    paddingHorizontal: dynamicWidth(4),
    paddingVertical: dynamicHeight(1),
  },
  button: {
    borderRadius: dynamicWidth(2),
    zIndex: 1,
  },
  backButton: {
    width: dynamicWidth(12),
    justifyContent: "center",
    alignItems: "center",
  },
  rightButton: {
    marginRight: dynamicWidth(4),
  },
  menuButton: {
    paddingRight: dynamicWidth(2.5),
  },
  title: {
    position: "absolute",
    left: dynamicWidth(18),
    right: dynamicWidth(18),
    textAlign: "center",
    fontSize: dynamicWidth(4.5),
    lineHeight: dynamicHeight(2.5),
    color: "white",
  },
  backIcon: {
    position: "absolute",
    left: dynamicWidth(2.5),
    top: "50%",
    transform: [{ translateY: -dynamicHeight(1.5) }],
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: dynamicWidth(9),
    height: dynamicWidth(9),
    borderRadius: dynamicWidth(4.5),
    marginRight: dynamicWidth(2.5),
  },
  textContainer: {
    flexDirection: "column",
  },
  greeting: {
    fontSize: dynamicWidth(3.7),
    color: "white",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: dynamicWidth(3.2),
    color: "white",
  },
});

export default memo(Header);
