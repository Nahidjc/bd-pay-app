import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
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
import HelloWorldScreen from "../components/HelloWorld";
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
    height: dynamicHeight(1),
  },
  shadowOpacity: 0.25,
  shadowRadius: dynamicHeight(0.5),
  elevation: 5,
};

const CustomTabBarButton = ({ children }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        top: -dynamicHeight(2),
        justifyContent: "center",
        alignItems: "center",
        ...shadowStyle,
      }}
      onPress={() => navigation.navigate("ScanQrCodeScreen")}
    >
      <View
        style={{
          width: dynamicWidth(12),
          height: dynamicWidth(12),
          borderRadius: dynamicWidth(6),
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#E6E6E6",
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let Icon;
          switch (route.name) {
            case "Dashboard":
              Icon = House;
              break;
            case "Statements":
              Icon = BarChart2;
              break;
            case "Notifications":
              Icon = Bell;
              break;
            case "Settings":
              Icon = Settings;
              break;
            default:
              Icon = Wallet;
          }
          return (
            <Icon
              size={dynamicWidth(6)}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
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
                color="#E91E63"
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
    backgroundColor: "#ffffff",
    borderTopWidth: 0,
    marginTop: dynamicHeight(2),
    height: dynamicHeight(7),
    borderRadius: dynamicWidth(5),
    marginBottom: dynamicHeight(1.5),
    marginHorizontal: dynamicWidth(3),
    justifyContent: "space-between",
    paddingHorizontal: dynamicWidth(2),
    ...shadowStyle,
  },
});

export default TabNavigator;
