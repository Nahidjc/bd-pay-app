import React, { lazy, Suspense } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import DashboardScreen from "./Screen/DashboardScreen";
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
import RegistrationScreen from "./Screen/Auth/RegistrationScreen";
import LoginScreen from "./Screen/Auth/LoginScreen";
import SettingsScreen from "./Screen/Setting/Setting";
import ProfileScreen from "./Screen/Profile/ProfileScreen";
import ChangeNameScreen from "./Screen/Setting/ChangeNameScreen";
import ChangePictureScreen from "./Screen/Setting/ChangeProfileScreen";
import MyQrCodeScreen from "./Screen/QRCode/MyQrCodeScreen";
import InitialCashOutScreen from "./Screen/CashOut/InitialCashOutScreen";
import ScanQrCodeScreen from "./Screen/QRCode/ScanQrCodeScreen";
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
      <Drawer.Screen
        name="Setting"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          header: (props) => <Header {...props} title="Setting" />,
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

const AuthenticatedStack = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Group>
        <Stack.Screen
          name="InitialSendMoney"
          component={SendMoneyScreen}
          options={{
            title: t("send"),
            headerStyle: { backgroundColor: "#E91E63" },
          }}
        />
        <Stack.Screen
          name="ConfirmSendMoney"
          component={ConfirmSendMoneyScreen}
          options={{
            title: t("send"),
            headerStyle: { backgroundColor: "#E91E63" },
          }}
        />
        <Stack.Screen
          name="SendMoney"
          component={SendMoney}
          options={{
            title: t("send"),
            headerStyle: { backgroundColor: "#E91E63" },
          }}
        />
        <Stack.Screen
          name="TransactionSuccess"
          component={TransactionSuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Profile",
            headerStyle: { backgroundColor: "#E91E63" },
          }}
        />
        <Stack.Screen
          name="ChangeName"
          component={ChangeNameScreen}
          options={{
            title: t("change_name"),
            headerStyle: { backgroundColor: "#E91E63" },
          }}
        />
        <Stack.Screen
          name="ChangePicture"
          component={ChangePictureScreen}
          options={{
            title: t("change_picture"),
            headerStyle: { backgroundColor: "#E91E63" },
          }}
        />
        <Stack.Screen
          name="QRCode"
          component={MyQrCodeScreen}
          options={{
            title: t("qrCode"),
            headerStyle: { backgroundColor: "#E91E63" },
          }}
        />
        <Stack.Screen
          name="InitialCashOutScreen"
          component={InitialCashOutScreen}
          options={{
            title: "Cash Out",
            headerStyle: { backgroundColor: "#E91E63" },
          }}
        />
        <Stack.Screen
          name="ScanQrCodeScreen"
          component={ScanQrCodeScreen}
          options={{
            title: "Scan QR",
            headerStyle: { backgroundColor: "#E91E63" },
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const UnauthenticatedStack = () => {
  const isOnboarded = getOnboardingStatus();

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Group screenOptions={{ headerShown: false }}>
        {!isOnboarded && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default function MainApp() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <SafeAreaProvider>
      <StatusBar
        style="auto"
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <NavigationContainer>
        {isAuthenticated ? <AuthenticatedStack /> : <UnauthenticatedStack />}
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
