import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  Wallet,
  BarChart2,
  QrCode,
  Settings,
  House,
  Bell,
} from "lucide-react-native";
import DashboardScreen from "../Screen/DashboardScreen";
import StatementScreen from "../Screen/Transaction/Transaction";
import Header from "../components/Navigation/Header";
import SettingsScreen from "../Screen/Setting/Setting";
import NotificationScreen from "../Screen/Notification/NotificationScreen";

const Tab = createBottomTabNavigator();
const { height, width } = Dimensions.get("window");

const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicWidth = (percentage) => (width * percentage) / 100;

const shadowStyle = {
  shadowColor: "#7F5DF0",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 5,
};

const CustomTabBarButton = ({ children }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.customTabButton}
      onPress={() => navigation.navigate("ScanQrCodeScreen")}
    >
      <View style={styles.qrButton}>{children}</View>
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let Icon;
          let label;
          switch (route.name) {
            case "Dashboard":
              Icon = House;
              label = "Home";
              break;
            case "Statements":
              Icon = BarChart2;
              label = "Statements";
              break;
            case "Notifications":
              Icon = Bell;
              label = "Notifications";
              break;
            case "Settings":
              Icon = Settings;
              label = "Settings";
              break;
            default:
              Icon = Wallet;
          }
          return (
            <View style={styles.iconContainer}>
              <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              <Text
                style={[
                  styles.iconLabel,
                  { color: focused ? "#6c5ce7" : "#C6C6C6" },
                ]}
              >
                {label}
              </Text>
            </View>
          );
        },
        tabBarActiveTintColor: "#E91E63",
        tabBarInactiveTintColor: "#C6C6C6",
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: true,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerStyle: { backgroundColor: "#E91E63" },
          header: (props) => (
            <Header {...props} tabName="Dashboard" user={user} />
          ),
        }}
      />
      <Tab.Screen
        name="Statements"
        component={StatementScreen}
        options={{
          headerStyle: { backgroundColor: "#E91E63" },
          header: (props) => <Header {...props} tabName="Statements" />,
        }}
      />
      <Tab.Screen
        name="QRCode"
        component={EmptyComponent}
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <QrCode
                size={dynamicWidth(6)}
                color="#FFFFFF"
                strokeWidth={2.5}
              />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          headerStyle: { backgroundColor: "#E91E63" },
          header: (props) => <Header {...props} tabName="HelloWorld" />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerStyle: { backgroundColor: "#E91E63" },
          header: (props) => <Header {...props} tabName="Settings" />,
        }}
      />
    </Tab.Navigator>
  );
};

const EmptyComponent = () => null;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    height: dynamicHeight(8),
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    ...shadowStyle,
  },
  customTabButton: {
    top: -dynamicHeight(3),
    justifyContent: "center",
    alignItems: "center",
    ...shadowStyle,
  },
  qrButton: {
    width: dynamicWidth(14),
    height: dynamicWidth(14),
    borderRadius: dynamicWidth(7),
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TabNavigator;
