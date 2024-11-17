import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import { PermissionsAndroid, Platform } from "react-native";
import { store } from "./../state/store";
import { logout } from "../state/reducers/authSlice";

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Notification permission granted, status:", authStatus);
  } else {
    console.log("Notification permission denied");
  }
}

export async function getFCMToken() {
  const token = await messaging().getToken();
  return token;
}

// Handle foreground messages
messaging().onMessage(async (remoteMessage) => {
  console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));

  if (remoteMessage.data?.action === "logout") {
    await handleLogout();
  } else {
    const imageUrl = remoteMessage.notification?.android?.imageUrl || null;
    PushNotification.localNotification({
      channelId: "default-channel-id",
      title: remoteMessage.notification?.title || "New Notification",
      message: remoteMessage.notification?.body || "You have a new message",
      bigPictureUrl: imageUrl,
      largeIconUrl: imageUrl,
    });
  }
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background notification:", JSON.stringify(remoteMessage));
  if (remoteMessage.data?.action === "logout") {
    await handleLogout();
  }
});

async function handleLogout() {
  store.dispatch(logout());
  PushNotification.localNotification({
    channelId: "default-channel-id",
    title: "Logged Out",
    message:
      "You have been logged out because your account was accessed from another device.",
  });
}

export const registerPushNotifications = () => {
  requestUserPermission();
  PushNotification.createChannel(
    {
      channelId: "default-channel-id",
      channelName: "Default Channel",
      channelDescription: "A default notification channel",
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Notification channel created: ${created}`)
  );
};

export function getDeviceType() {
  return Platform.OS === "ios" ? "iOS" : "Android";
}
