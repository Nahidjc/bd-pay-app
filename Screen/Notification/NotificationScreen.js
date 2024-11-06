import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Bell } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../state/reducers/notificationSlice";
import LoadingScreen from "../../components/Loader/Loader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const NotificationItem = ({ item, onPress }) => {
  const formattedDate = useMemo(
    () =>
      new Date(item.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    [item.createdAt]
  );

  return (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.iconContainer}>
          <Bell size={20} color="#E91E63" strokeWidth={2.5} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        {item.notificationImage && (
          <Image
            source={{ uri: item.notificationImage }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconContainer}>
      <Bell size={48} color="#E91E63" strokeWidth={1.5} />
    </View>
    <Text style={styles.emptyTitle}>No Notifications Available</Text>
    <Text style={styles.emptySubtitle}>
      Stay tuned for updates and important information.
    </Text>
  </View>
);

const NotificationDetails = ({ notification }) => {
  const formattedDate = useMemo(
    () =>
      notification
        ? new Date(notification.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "",
    [notification]
  );

  if (!notification) return null;

  return (
    <BottomSheetView style={styles.detailsContainer}>
      {notification.notificationImage && (
        <Image
          source={{ uri: notification.notificationImage }}
          style={styles.detailImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.detailsContent}>
        <Text style={styles.detailTitle}>{notification.title}</Text>
        <Text style={styles.detailBody}>{notification.body}</Text>
        <Text style={styles.detailDate}>{formattedDate}</Text>
      </View>
    </BottomSheetView>
  );
};

const NotificationScreen = () => {
  const dispatch = useDispatch();
  const { isLoading, notifications } = useSelector(
    (state) => state.notificationsReducer
  );
  const { token } = useSelector((state) => state.auth);

  const [selectedNotification, setSelectedNotification] = useState(null);
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchNotifications(token));
    }, 100);
    return () => clearTimeout(timer);
  }, [dispatch, token]);

  const snapPoints = selectedNotification
    ? [
        selectedNotification.notificationImage
          ? "60%"
          : selectedNotification.body.length > 100
          ? "30%"
          : "20%",
        "60%",
      ]
    : ["20%"];

  const handleNotificationPress = useCallback((notification) => {
    setSelectedNotification(notification);
    bottomSheetRef.current?.expand();
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) setSelectedNotification(null);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingScreen visible={isLoading} />}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handleNotificationPress} />
        )}
        contentContainerStyle={[
          styles.listContainer,
          notifications.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <NotificationDetails notification={selectedNotification} />
      </BottomSheet>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  notificationItem: {
    marginBottom: 12,
  },
  notificationContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF2F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContent: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 6,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: "#999999",
    letterSpacing: -0.2,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F9FAFB",
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F3F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 6,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  // Bottom Sheet Styles
  bottomSheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  detailsContainer: {
    padding: 16,
  },
  detailImage: {
    width: SCREEN_WIDTH - 32,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  detailsContent: {
    paddingBottom: 32,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  detailBody: {
    fontSize: 16,
    color: "#4A4A4A",
    lineHeight: 24,
    marginBottom: 12,
  },
  detailDate: {
    fontSize: 14,
    color: "#999999",
    letterSpacing: -0.2,
  },
});

export default NotificationScreen;
