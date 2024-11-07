import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import WelcomeScreen from "./components/WelcomeScreen";
import OnboardingScreen from "./Screen/OnboardingScreen";
import { LogBox } from "react-native";
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
import { enableScreens } from "react-native-screens";
import { CardStyleInterpolators } from "@react-navigation/stack";
import AddMoneyScreen from "./Screen/AddMoney/AddMoneyScreen";
import GlobalWalletScreen from "./Screen/AddMoney/GlobalWalletScreen";
import BankScreen from "./Screen/AddMoney/BankScreen";
enableScreens();
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
      <Stack.Group
        screenOptions={{
          headerStyle: { backgroundColor: "#E91E63" },
        }}
      >
        <Stack.Screen
          name="InitialSendMoney"
          component={SendMoneyScreen}
          options={{
            title: t("send"),
          }}
        />
        <Stack.Screen
          name="ConfirmSendMoney"
          component={ConfirmSendMoneyScreen}
          options={{
            title: t("send"),
          }}
        />
        <Stack.Screen
          name="SendMoney"
          component={SendMoney}
          options={{
            title: t("send"),
          }}
        />
        <Stack.Screen
          name="AddMoneyScreen"
          component={AddMoneyScreen}
          options={{
            title: "Add Money",
          }}
        />
        <Stack.Screen
          name="GlobalWalletScreen"
          component={GlobalWalletScreen}
          options={{
            title: "Global Wallet",
          }}
        />
        <Stack.Screen
          name="BankScreen"
          component={BankScreen}
          options={{
            title: "Bank to BD Pay",
          }}
        />
        <Stack.Screen
          name="TransactionSuccess"
          component={TransactionSuccessScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Profile",
          }}
        />
        <Stack.Screen
          name="ChangeName"
          component={ChangeNameScreen}
          options={{
            title: t("change_name"),
          }}
        />
        <Stack.Screen
          name="ChangePicture"
          component={ChangePictureScreen}
          options={{
            title: t("change_picture"),
          }}
        />
        <Stack.Screen
          name="QRCode"
          component={MyQrCodeScreen}
          options={{
            title: t("qrCode"),
          }}
        />
        <Stack.Screen
          name="InitialCashOutScreen"
          component={InitialCashOutScreen}
          options={{
            title: "Cash Out",
          }}
        />
        <Stack.Screen
          name="ScanQrCodeScreen"
          component={ScanQrCodeScreen}
          options={{
            title: "Scan QR",
            cardStyleInterpolator:
              CardStyleInterpolators.forModalPresentationIOS,
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
    <SafeAreaProvider
      initialMetrics={{
        insets: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      }}
    >
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
