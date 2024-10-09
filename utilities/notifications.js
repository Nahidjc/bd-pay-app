import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import { PermissionsAndroid } from "react-native";

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

// Get FCM Token
export async function getFCMToken() {
  const token = await messaging().getToken();
  console.log("FCM Token:", token);
  return token;
}

// Handle foreground messages
messaging().onMessage(async (remoteMessage) => {
  console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
  const imageUrl = remoteMessage.notification?.android?.imageUrl || null;
  PushNotification.localNotification({
    channelId: "default-channel-id",
    title: remoteMessage.notification?.title || "New Notification",
    message: remoteMessage.notification?.body || "You have a new message",
    bigPictureUrl: imageUrl,
    largeIconUrl: imageUrl,
  });
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background notification:", JSON.stringify(remoteMessage));
});

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
