import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { useAppState } from "../hooks/useAppState";

export const AppWrapper = ({ children }) => {
  const resetInactivityTimeout = useAppState();

  const handleInteraction = () => {
    resetInactivityTimeout();
  };

  return (
    <TouchableWithoutFeedback onPress={handleInteraction}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
};
