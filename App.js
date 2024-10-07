import { store } from "./state/store";
import { Provider } from "react-redux";
import MainApp from "./MainApp";
import { useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import messaging from '@react-native-firebase/messaging';
import { registerPushNotifications } from './utilities/notifications';
import PushNotification from "react-native-push-notification";
export default function App() {
  useEffect(() => {
    const hideSplashScreen = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      SplashScreen.hide();
    };

    hideSplashScreen();

    // PushNotification.createChannel(
    //   {
    //     channelId: "default-channel-id",
    //     channelName: "Default Channel",
    //     channelDescription: "A default notification channel", 
    //     importance: 4,
    //     vibrate: true, 
    //   },
    //   (created) => console.log(`Notification channel created: ${created}`)
    // );
    registerPushNotifications();
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        }
      });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}
