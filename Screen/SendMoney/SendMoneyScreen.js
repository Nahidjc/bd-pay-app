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
import { useTranslation } from "react-i18next";
import LoadingScreen from "../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { checkSendMoney } from "../../state/reducers/sendMoneySlice";
import { showMessage } from "react-native-flash-message";

const { width } = Dimensions.get("window");
const baseWidth = 375;
const scale = width / baseWidth;

export default function SendMoneyScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.sendMoney);
  const { token } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      async function loadContacts() {
        try {
          const contactsData = await getContacts();
          setContacts(contactsData || []);
        } catch (error) {
          setContacts([]);
        } finally {
          setLoading(false);
        }
      }

      loadContacts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const formatPhoneNumber = (number) => {
    const cleanedNumber = number.replace(/\D/g, "");
    return cleanedNumber.length === 11 ? cleanedNumber : null;
  };

  const filteredContacts = contacts
    .filter(
      (contact) =>
        contact.phoneNumbers &&
        contact.phoneNumbers.length > 0 &&
        formatPhoneNumber(contact.phoneNumbers[0].number)
    )
    .filter((contact) => {
      const formattedNumber = formatPhoneNumber(contact.phoneNumbers[0].number);
      return (
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (formattedNumber && formattedNumber.includes(searchQuery))
      );
    });

  const handleSendMoneyCheck = async (recipient) => {
    const formattedNumber = formatPhoneNumber(recipient.number);
    if (formattedNumber) {
      try {
        const response = await dispatch(
          checkSendMoney({
            token,
            accountNumber: formattedNumber,
          })
        ).unwrap();
        if (response.isAvailable && response.isPersonalAccountNumber) {
          navigation.navigate("ConfirmSendMoney", {
            recipient,
            availableBalance: response.balance,
          });
        } else {
          showMessage({
            message: "Unable to proceed. Account not eligible.",
            type: "danger",
            backgroundColor: "#e2136e",
          });
        }
      } catch (error) {
        showMessage({
          message:
            error.data?.error || error.data?.message || "An error occurred",
          type: "danger",
          backgroundColor: "#e2136e",
        });
      }
    }
  };

  const handleContactPress = (contact) => {
    const recipient = {
      name: contact.name,
      number: formatPhoneNumber(contact.phoneNumbers[0].number),
      avatar: contact.name[0],
    };
    handleSendMoneyCheck(recipient);
  };

  const handleManualEntryPress = () => {
    if (searchQuery) {
      const recipient = {
        name: searchQuery,
        number: searchQuery,
        avatar: searchQuery[0],
      };
      handleSendMoneyCheck(recipient);
    }
  };

  const isEnglishLetter = (char) => /^[A-Za-z]$/.test(char);

  return (
    <View style={styles.container}>
      <LoadingScreen visible={loading || isLoading} />
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20 * scale}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={t("placeholder_name_or_number")}
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
                {formatPhoneNumber(item.phoneNumbers[0].number)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyMessage}>
              {t("send_money_message", {
                query: searchQuery || t("default_number"),
              })}
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleManualEntryPress}
            >
              <Text style={styles.actionButtonText}>{t("tap_to_proceed")}</Text>
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
