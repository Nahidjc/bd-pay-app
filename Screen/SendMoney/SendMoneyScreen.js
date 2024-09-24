import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { getContacts } from "../../utilities/contactsHelpers";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const baseWidth = 375;
const scale = width / baseWidth;

export default function SendMoneyScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadContacts() {
      try {
        const contactsData = await getContacts();
        setContacts(contactsData || []);
      } catch (error) {
        setContacts([]);
      }
    }
    loadContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const hasPhoneNumber =
      contact.phoneNumbers && contact.phoneNumbers.length > 0;
    return (
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hasPhoneNumber && contact.phoneNumbers[0].number.includes(searchQuery))
    );
  });

  const handleContactPress = (contact) => {
    navigation.navigate("ConfirmSendMoney", {
      recipient: {
        name: contact.name,
        number: contact.phoneNumbers[0]?.number,
        avatar: contact.name[0],
      },
    });
  };

  const handleManualEntryPress = () => {
    if (searchQuery) {
      navigation.navigate("ConfirmSendMoney", {
        recipient: {
          name: searchQuery,
          number: searchQuery,
          avatar: searchQuery[0],
        },
      });
    }
  };
  const isEnglishLetter = (char) => /^[A-Za-z]$/.test(char);
  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20 * scale}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="নাম বা নম্বর দিন"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleContactPress(item)}
            style={styles.contactItem}
          >
            <View style={styles.avatar}>
              {isEnglishLetter(item.name[0]) ? (
                <Avatar
                  rounded
                  title={item.name[0]}
                  size={50 * scale}
                  containerStyle={{ backgroundColor: "#E1BEE7" }}
                />
              ) : (
                <Ionicons name="person" size={25 * scale} color="white" />
              )}
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactNumber}>
                {item.phoneNumbers && item.phoneNumbers[0]?.number}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyMessage}>{`${
              searchQuery || "একটি নম্বর"
            } -কে সেন্ড মানি করুন`}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleManualEntryPress} // Call manual entry handler
            >
              <Text style={styles.actionButtonText}>
                পরের ধাপে যেতে ট্যাপ করুন
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#E91E63",
    height: 56 * scale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16 * scale,
  },
  backIcon: {
    position: "absolute",
    left: 16 * scale,
    top: "50%",
    transform: [{ translateY: -12 * scale }],
  },
  headerTitle: {
    fontSize: 20 * scale,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12 * scale,
    marginBottom: 12 * scale,
    marginTop: 12 * scale,
    marginHorizontal: 6 * scale,
    paddingHorizontal: 16 * scale,
    paddingVertical: 10 * scale,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16 * scale,
    color: "#000",
  },
  searchIcon: {
    marginRight: 10 * scale,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14 * scale,
    paddingHorizontal: 10 * scale,
    marginBottom: 8 * scale,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
  },
  contactDetails: {
    marginLeft: 12 * scale,
  },
  contactName: {
    fontSize: 16 * scale,
    color: "#333",
    fontWeight: "bold",
  },
  contactNumber: {
    fontSize: 14 * scale,
    color: "#666",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50 * scale,
  },
  emptyMessage: {
    fontSize: 18 * scale,
    color: "#333",
    marginBottom: 20 * scale,
  },
  actionButton: {
    backgroundColor: "#E91E63",
    borderRadius: 20 * scale,
    paddingVertical: 12 * scale,
    paddingHorizontal: 30 * scale,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16 * scale,
    fontWeight: "bold",
  },
  avatar: {
    width: 50 * scale,
    height: 50 * scale,
    borderRadius: 25 * scale,
    backgroundColor: "#E1BEE7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
});
