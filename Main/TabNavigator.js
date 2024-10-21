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

const Tab = createBottomTabNavigator();
const { height, width } = Dimensions.get("window");

const shadowStyle = {
  shadowColor: "#7F5DF0",
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.5,
  elevation: 5,
};

const CustomTabBarButton = ({ children }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        top: -30,
        justifyContent: "center",
        alignItems: "center",
        ...shadowStyle,
      }}
      onPress={() => navigation.navigate("ScanQrCodeScreen")}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
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
            case "HelloWorld":
              Icon = Bell;
              break;
            case "Settings":
              Icon = Settings;
              break;
            default:
              Icon = Wallet;
          }
          return (
            <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          );
        },
        tabBarActiveTintColor: "#E91E63",
        tabBarInactiveTintColor: "#C6C6C6",
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
              <QrCode size={30} color="#E91E63" strokeWidth={2.5} />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tab.Screen
        name="HelloWorld"
        component={HelloWorldScreen}
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
    marginTop: 20,
    height: 70,
    borderRadius: 20,
    marginBottom: 10,
    marginHorizontal: 10,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    ...shadowStyle,
  },
});

export default TabNavigator;
