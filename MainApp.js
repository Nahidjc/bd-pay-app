import React, { lazy, Suspense } from "react";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
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
import SendMoneyScreen from "./Screen/SendMoney/SendMoneyScreen";
import ConfirmSendMoneyScreen from "./Screen/SendMoney/ConfirmSendMoney";
import SendMoney from "./Screen/SendMoney/SendMoney";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "./components/Navigation/Header";
import "./utilities/i18n";
import { CustomDrawerContent } from "./components/Drawer/CustomDrawerContent";
import { TransactionLimitScreen } from "./Screen/TransactionLimit/TransactionLimit";
import { getOnboardingStatus } from "./state/storage";
import TransactionSuccessScreen from "./Screen/SendMoney/TransactionSuccessScreen";
import LoadingScreen from "./components/Loader/Loader";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
LogBox.ignoreAllLogs();

const Drawer = createDrawerNavigator();

const StatementScreen = lazy(() => import("./Screen/Transaction/Transaction"));

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

const StatementWrapper = () => {
  useFocusEffect(
    React.useCallback(() => {
      // Preload data or start heavy computations here
      // For example: dispatch(fetchStatementData());
    }, [])
  );

  return (
    <Suspense fallback={<LoadingScreen />}>
      <StatementScreen />
    </Suspense>
  );
};

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
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#7F3DFF",
        tabBarInactiveTintColor: "#C6C6C6",
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: true,
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
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
        component={StatementWrapper}
        options={{
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          header: (props) => <Header {...props} tabName="Statements" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default function MainApp() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isOnboarded = getOnboardingStatus();
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
            header: (props) => <Header {...props} />,
            animation: "slide_from_right",
          }}
        >
          {isAuthenticated ? (
            <>
              <Stack.Group>
                <Stack.Screen
                  name="DrawerNavigator"
                  component={DrawerNavigator}
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack.Group>

              <Stack.Group>
                <Stack.Screen
                  options={{
                    title: "সেন্ড মানি",
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
                    title: "সেন্ড মানি",
                    headerStyle: {
                      backgroundColor: "#E91E63",
                    },
                  }}
                  component={ConfirmSendMoneyScreen}
                />
                <Stack.Screen
                  name="SendMoney"
                  options={{
                    title: "সেন্ড মানি",
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