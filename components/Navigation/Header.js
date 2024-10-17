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
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
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
    if (user?.shopLogo) {
      setSecureImageUrl(user.shopLogo.replace("http://", "https://"));
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
        <View style={[styles.profileImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>
            {user?.ownerName ? user.ownerName[0].toUpperCase() : "?"}
          </Text>
        </View>
      ) : (
        <Image
          source={{ uri: secureImageUrl }}
          style={styles.profileImage}
          resizeMode="cover"
          onError={handleImageError}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>{user?.ownerName || t("user")}</Text>
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
      <Ionicons name="menu" size={24} color="white" />
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
    height: 50,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 16,
    zIndex: 1,
  },
  backButton: {
    width: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  rightButton: {
    marginRight: 16,
  },
  menuButton: {
    paddingRight: 10,
  },
  title: {
    position: "absolute",
    left: 72,
    right: 72,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
    color: "white",
  },
  backIcon: {
    position: "absolute",
    left: 10 * scale,
    top: "50%",
    transform: [{ translateY: -12 * scale }],
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderImage: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  textContainer: {
    flexDirection: "column",
  },
  greeting: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "white",
  },
});

export default memo(Header);
