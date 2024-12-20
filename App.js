import { store } from "./state/store";
import { Provider } from "react-redux";
import FlashMessage from "react-native-flash-message";
import MainApp from "./MainApp";
import { Suspense, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import messaging from "@react-native-firebase/messaging";
import { registerPushNotifications } from "./utilities/notifications";
import LoadingScreen from "./components/Loader/Loader";
import { ThemeProvider } from "./context/ThemeProvider";
import { StripeProvider } from "@stripe/stripe-react-native";
export default function App() {
  useEffect(() => {
    const hideSplashScreen = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      SplashScreen.hide();
    };

    hideSplashScreen();
    registerPushNotifications();
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <StripeProvider
          urlScheme="bdpay"
          publishableKey="pk_test_51N8zbXCYlfhEx0YIi9bWofbZUr7H8qZaKkN8tkNFtOXcwyW24fL7mLFz3LDlycvXF4qqhhany9rm6MDsMIZjWaGU00dFPj02U3"
        >
          <Suspense fallback={<LoadingScreen />}>
            <MainApp />
            <FlashMessage position="bottom" />
          </Suspense>
        </StripeProvider>
      </ThemeProvider>
    </Provider>
  );
}
