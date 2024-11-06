import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Bell } from "lucide-react-native";

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
      <Bell size={48} color="#E0E0E0" strokeWidth={1.5} />
    </View>
    <Text style={styles.emptyTitle}>No Notifications Yet</Text>
    <Text style={styles.emptySubtitle}>
      We'll notify you when something important happens
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
  const [selectedNotification, setSelectedNotification] = useState(null);
  const bottomSheetRef = useRef(null);

  // Define fixed snap points
  const snapPoints = useMemo(() => ["20%", "55%"], []);

  const notifications = [
    {
      _id: "67287e3333264fb8f8b7dd14",
      userId: "671e75e0d9d903d95e0e8a6f",
      title: "Money Transfer Received",
      body: "You have received BDT 200.00 from 01910125428. Fee BDT 0.00. Balance BDT 37,580.00. TrxID BIBC07BE5K at 2024-11-04T07:56:27.572Z",
      type: "Money Received",
      createdAt: "2024-11-04T07:56:35.236Z",
      notificationImage:
        "https://www.bkash.com/uploaded_contents/cms/Website-Banner-1400x700_1678022840404.jpg",
      __v: 0,
    },
    {
      _id: "6720a96606d484f1b9cf9c4f",
      userId: "671e75e0d9d903d95e0e8a6f",
      title: "Money Transfer Received",
      body: "You have received BDT 100.00 from 01910125428. Fee BDT 0.00. Balance BDT 44,700.00. TrxID BIBH8YGC3Z at 2024-10-29T09:22:45.049Z",
      type: "Money Received",
      createdAt: "2024-10-29T09:22:46.585Z",
      notificationImage:
        "https://www.bkash.com/uploaded_contents/cms/1400x700-5_1698818648437.jpg",
      __v: 0,
    },
    {
      _id: "6720a87406d484f1b9cf9c4c",
      userId: "671e75e0d9d903d95e0e8a6f",
      title: "Money Transfer Received",
      body: "You have received BDT 100.00 from 01910125428. Fee BDT 0.00. Balance BDT 44,600.00. TrxID BIBN2LS7JC at 2024-10-29T09:18:42.594Z",
      type: "Money Received",
      createdAt: "2024-10-29T09:18:44.282Z",
      __v: 0,
    },
    {
      _id: "671e8026c699c879eb93f4db",
      userId: "671e75e0d9d903d95e0e8a6f",
      title: "Money Transfer Received",
      body: "You have received BDT 500.00 from 01981256456. Fee BDT 0.00. Balance BDT 49,000.00. TrxID BIBD7UR8U4 at 2024-10-27T18:02:09.435Z",
      type: "Money Received",
      createdAt: "2024-10-27T18:02:14.181Z",
      __v: 0,
    },
    {
      _id: "671e75e865664a825b5c1fc9",
      userId: "671e75e0d9d903d95e0e8a6f",
      title: "Registration Successful",
      body: "Thank you for registering! You can now access all features of the app.",
      type: "Registration",
      createdAt: "2024-10-27T17:18:32.465Z",
      __v: 0,
    },
  ];

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
    if (index === -1) {
      setSelectedNotification(null);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
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
