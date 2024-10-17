import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import {
  Home,
  BarChart,
  AlertTriangle,
  Ticket,
  Info,
  Edit3,
  Users,
  LogOut,
  Settings,
} from "lucide-react-native";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { logout } from "../../state/reducers/authSlice";
import { getLanguage, storage, StorageKeys } from "../../state/storage";

const saveLanguage = (language) => {
  storage.set(StorageKeys.Language, language);
};

const loadLanguage = () => {
  const lang = getLanguage();
  return lang;
};

export const CustomDrawerContent = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedLanguage = loadLanguage();
    i18n.changeLanguage(savedLanguage);
  }, []);

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "bn" : "en";
    i18n.changeLanguage(newLanguage);
    saveLanguage(newLanguage);
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
            {i18n.language === "en" ? "বাংলা" : "English"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Home size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("home")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Statements")}
        >
          <BarChart size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("statement")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Limit")}
        >
          <AlertTriangle size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("limit")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ticket size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("coupon")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Info size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("info_update")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Edit3 size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("nominee_update")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Users size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("refer_app")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Setting")}
        >
          <Settings size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>{t("settings")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <LogOut size={24} style={styles.menuIcon} />
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
    marginRight: 20,
    color: "#e3007b",
  },
  menuText: {
    fontSize: 15,
    color: "#000",
  },
});
