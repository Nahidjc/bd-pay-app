import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { logout } from "../../state/reducers/authSlice";
export const CustomDrawerContent = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const dispatch = useDispatch();
  const toggleLanguage = () => {
    i18n.changeLanguage(isEnglish ? "bn" : "en");
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <View style={styles.drawerContainer}>
      <ScrollView>
        <Text style={styles.drawerTitle}>{t("menu")}</Text>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={toggleLanguage}
        >
          <Text style={styles.languageButtonText}>
            {isEnglish ? "বাংলা" : "English"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <AntDesign name="home" size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("home")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Statements")}
        >
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuText}>{t("statement")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Limit")}
        >
          <Text style={styles.menuIcon}>⚠️</Text>
          <Text style={styles.menuText}>{t("limit")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuIcon}>🎟️</Text>
          <Text style={styles.menuText}>{t("coupon")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuIcon}>ℹ️</Text>
          <Text style={styles.menuText}>{t("info_update")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuIcon}>📝</Text>
          <Text style={styles.menuText}>{t("nominee_update")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <FontAwesome5 name="user-friends" size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("refer_app")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <AntDesign name="logout" size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  drawerTitle: {
    fontSize: 20,
    color: "#e3007b",
    fontWeight: "bold",
    marginTop: 20,
  },
  languageButton: {
    borderWidth: 1,
    borderColor: "#e3007b",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    marginVertical: 20,
  },
  languageButtonText: {
    color: "#e3007b",
    fontSize: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 20,
    color: "#e3007b",
  },
  menuText: {
    fontSize: 15,
    color: "#000",
  },
});
