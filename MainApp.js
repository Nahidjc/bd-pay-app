import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import WelcomeScreen from "./components/WelcomeScreen";
import OnboardingScreen from "./Screen/OnboardingScreen";
import { StyleSheet, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SendMoneyScreen from "./Screen/SendMoney/SendMoneyScreen";
import ConfirmSendMoneyScreen from "./Screen/SendMoney/ConfirmSendMoney";
import SendMoney from "./Screen/SendMoney/SendMoney";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "./components/Navigation/Header";
import { getOnboardingStatus } from "./state/storage";
import TransactionSuccessScreen from "./Screen/SendMoney/TransactionSuccessScreen";
import "./utilities/i18n";
import { useTranslation } from "react-i18next";
import RegistrationScreen from "./Screen/Auth/RegistrationScreen";
import LoginScreen from "./Screen/Auth/LoginScreen";
import ProfileScreen from "./Screen/Profile/ProfileScreen";
import ChangeNameScreen from "./Screen/Setting/ChangeNameScreen";
import ChangePictureScreen from "./Screen/Setting/ChangeProfileScreen";
import MyQrCodeScreen from "./Screen/QRCode/MyQrCodeScreen";
import InitialCashOutScreen from "./Screen/CashOut/InitialCashOutScreen";
import ScanQrCodeScreen from "./Screen/QRCode/ScanQrCodeScreen";
import DrawerNavigator from "./Main/DrawerNavigator";
const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();

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
