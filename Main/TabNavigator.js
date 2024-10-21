import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import DashboardScreen from "../Screen/DashboardScreen";
import StatementScreen from "../Screen/Transaction/Transaction";
import Header from "../components/Navigation/Header";
import HelloWorldScreen from "../components/HelloWorld";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity style={styles.customTabButton} onPress={onPress}>
    <View style={styles.customTabButtonContent}>{children}</View>
  </TouchableOpacity>
);

const TabNavigator = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Statements") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          } else if (route.name === "HelloWorld") {
            iconName = focused ? "bookmark-sharp" : "bookmark-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#7F3DFF",
        tabBarInactiveTintColor: "#C6C6C6",
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: true,
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
        lazy: true,
        unmountOnBlur: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          header: (props) => (
            <Header {...props} tabName="Dashboard" user={user} />
          ),
        }}
      />
      <Tab.Screen
        name="Statements"
        component={StatementScreen}
        options={{
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          header: (props) => <Header {...props} tabName="Statements" />,
        }}
      />
      <Tab.Screen
        name="HelloWorld"
        component={HelloWorldScreen}
        options={{
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          header: (props) => <Header {...props} tabName="HelloWorld" />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  customTabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  customTabButtonContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
});

export default TabNavigator;
