import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  ToastAndroid,
} from "react-native";
import { Share2Icon, SendIcon, CopyIcon } from "lucide-react-native";
import { formatNotificationDate } from "../../utilities/helper/useCurrencyFormatter";

const { width } = Dimensions.get("window");
const fontSizeResponsive = width * 0.04;

const TransactionDetails = ({ transaction }) => {
  if (!transaction) return null;

  const handleCopyTransactionId = () => {
    Clipboard.setString(transaction.transId);
    ToastAndroid.show("Transaction ID copied to clipboard", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{transaction.transactionType}</Text>
        {/* <Text style={styles.close}>Close</Text> */}
      </View>

      <View style={styles.table}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Account</Text>
            <Text style={styles.value}>
              {transaction.receiverAccountNumber}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>
              {formatNotificationDate(transaction.transactionDate)}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>৳{transaction.amount}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Charge</Text>
            <Text style={styles.value}>৳{transaction.charge}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Transaction ID</Text>
            <View style={styles.transactionIdContainer}>
              <Text style={styles.value}>{transaction.transactionId}</Text>
              <TouchableOpacity onPress={handleCopyTransactionId}>
                <CopyIcon size={16} color="#333" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Reference</Text>
            <Text style={styles.value}>
              {transaction.referenceText || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <SendIcon size={20} color="#d1287d" />
          <Text style={styles.buttonText}>Send Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Share2Icon size={20} color="#d1287d" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: {
    fontSize: fontSizeResponsive + 2,
    fontWeight: "bold",
    color: "#333",
  },
  close: {
    fontSize: fontSizeResponsive,
    color: "#d1287d",
    fontWeight: "bold",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  label: {
    fontSize: fontSizeResponsive * 0.8,
    color: "#888",
    marginBottom: 5,
  },
  value: {
    fontSize: fontSizeResponsive * 0.8,
    color: "#333",
    fontWeight: "bold",
  },
  transactionIdContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderColor: "#d1287d",
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  buttonText: {
    fontSize: fontSizeResponsive,
    color: "#d1287d",
    marginLeft: 8,
  },
});

export default TransactionDetails;
