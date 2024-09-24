import React from "react";
import { FlatList, Text, View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const baseWidth = 375;
const scale = width / baseWidth;

export default function ContactList({ contacts }) {
  return (
    <FlatList
      data={contacts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.number}>{item.phoneNumbers[0].number}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10 * scale, // Manually scaled padding
  },
  name: {
    fontSize: 14 * scale, // Manually scaled font size for name
  },
  number: {
    fontSize: 12 * scale, // Manually scaled font size for number
  },
});
