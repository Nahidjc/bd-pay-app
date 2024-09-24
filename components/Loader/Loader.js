import { ActivityIndicator, View, Text } from "react-native";

export const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#6c5ce7" />
    <Text>Loading...</Text>
  </View>
);
