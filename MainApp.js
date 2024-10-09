import React, { lazy, Suspense } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import DashboardScreen from "./Screen/DashboardScreen";
import LoginScreen from "./components/LoginScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import OnboardingScreen from "./Screen/OnboardingScreen";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
const SendMoneyScreen = lazy(() =>
  import("./Screen/SendMoney/SendMoneyScreen")
);
import ConfirmSendMoneyScreen from "./Screen/SendMoney/ConfirmSendMoney";
import SendMoney from "./Screen/SendMoney/SendMoney";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "./components/Navigation/Header";

import { CustomDrawerContent } from "./components/Drawer/CustomDrawerContent";
const TransactionLimitScreen = lazy(() =>
  import("./Screen/TransactionLimit/TransactionLimit")
);
import { getOnboardingStatus } from "./state/storage";
const TransactionSuccessScreen = lazy(() =>
  import("./Screen/SendMoney/TransactionSuccessScreen")
);
const StatementScreen = lazy(() => import("./Screen/Transaction/Transaction"));
import "./utilities/i18n";
import HelloWorldScreen from "./components/HelloWorld";
import { useTranslation } from "react-i18next";
import LoadingScreen from "./components/Loader/Loader";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
LogBox.ignoreAllLogs();

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "front",
        drawerPosition: "right",
        headerShown: false,
      }}
    >
      <Drawer.Screen name="MainTabs" component={MainTabs} />
      <Drawer.Screen
        name="Limit"
        component={TransactionLimitScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          header: (props) => <Header {...props} title="Limit" />,
        }}
      />
    </Drawer.Navigator>
  );
};

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity style={styles.customTabButton} onPress={onPress}>
    <View style={styles.customTabButtonContent}>{children}</View>
  </TouchableOpacity>
);

const MainTabs = () => {
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
        options={{
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          header: (props) => <Header {...props} tabName="Statements" />,
        }}
      >
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <StatementScreen />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="HelloWorld"
        options={{
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          header: (props) => <Header {...props} tabName="HelloWorld" />,
        }}
      >
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <HelloWorldScreen />
          </Suspense>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default function MainApp() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isOnboarded = getOnboardingStatus();
  const { t } = useTranslation();
  return (
    <SafeAreaProvider>
      <StatusBar
        style="auto"
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            animation: "slide_from_right",
            header: (props) => <Header {...props} />,
          }}
        >
          {isAuthenticated ? (
            <>
              <Stack.Screen
                name="DrawerNavigator"
                component={DrawerNavigator}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Group>
                <Stack.Screen
                  options={{
                    title: t("send"),
                    headerStyle: {
                      backgroundColor: "#E91E63",
                    },
                  }}
                  name={"InitialSendMoney"}
                  component={SendMoneyScreen}
                />
                <Stack.Screen
                  name="ConfirmSendMoney"
                  options={{
                    title: t("send"),
                    headerStyle: {
                      backgroundColor: "#E91E63",
                    },
                  }}
                  component={ConfirmSendMoneyScreen}
                />
                <Stack.Screen
                  name="SendMoney"
                  options={{
                    title: t("send"),
                    headerStyle: {
                      backgroundColor: "#E91E63",
                    },
                  }}
                  component={SendMoney}
                />
                <Stack.Screen
                  name="TransactionSuccess"
                  options={{
                    headerShown: false,
                  }}
                  component={TransactionSuccessScreen}
                />
              </Stack.Group>
            </>
          ) : (
            <>
              <Stack.Group screenOptions={{ headerShown: false }}>
                {!isOnboarded && (
                  <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                  />
                )}

                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
              </Stack.Group>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

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
