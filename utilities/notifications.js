import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import { PermissionsAndroid } from "react-native";

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
}

// Get FCM Token
async function getFCMToken() {
  const token = await messaging().getToken();
  console.log("FCM Token:", token);
  return token;
}

// Handle foreground messages
messaging().onMessage(async (remoteMessage) => {
  console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
  PushNotification.localNotification({
    channelId: "default-channel-id",
    title: remoteMessage.notification?.title || "New Notification",
    message: remoteMessage.notification?.body || "You have a new message",
  });
});

// Register background message handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

export const registerPushNotifications = () => {
  requestUserPermission();
  getFCMToken();
};
