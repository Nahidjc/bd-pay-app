import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { useAppState } from "../hooks/useAppState";

export const AppWrapper = ({ children }) => {
  const resetInactivityTimeout = useAppState();

  return (
    <TouchableWithoutFeedback onPress={resetInactivityTimeout}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
};
