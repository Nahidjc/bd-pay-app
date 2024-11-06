import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { Bell } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const NotificationScreen = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const NotificationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notification Details</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedNotification?.notificationImage && (
              <Image
                source={{ uri: selectedNotification.notificationImage }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.modalTextContent}>
              <Text style={styles.modalNotificationTitle}>
                {selectedNotification?.title}
              </Text>
              <Text style={styles.modalNotificationBody}>
                {selectedNotification?.body}
              </Text>
              <Text style={styles.modalNotificationDate}>
                {selectedNotification &&
                  formatDateTime(selectedNotification.createdAt)}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationContainer}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.iconContainer}>
          <Bell size={20} color="#E91E63" />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
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

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Bell size={40} color="#999999" />
      <Text style={styles.emptyText}>No notifications yet</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
      />
      <NotificationModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 12,
  },
  notificationContainer: {
    marginBottom: 12,
  },
  notificationContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#999999",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666666",
  },
  modalContent: {
    padding: 16,
  },
  modalImage: {
    width: SCREEN_WIDTH - 32,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalTextContent: {
    paddingBottom: 20,
  },
  modalNotificationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  modalNotificationBody: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 12,
  },
  modalNotificationDate: {
    fontSize: 14,
    color: "#999999",
  },
});

export default NotificationScreen;
