import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const ErrorBoundaryFallback = memo(({ error, resetError, errorInfo }) => {
  const errorMessage = error?.message || "Something went wrong";

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorText}>{errorMessage}</Text>
      {__DEV__ && errorInfo && (
        <Text style={styles.errorDetails}>{errorInfo.componentStack}</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={resetError}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
});

ErrorBoundaryFallback.propTypes = {
  error: PropTypes.object,
  resetError: PropTypes.func.isRequired,
  errorInfo: PropTypes.object,
};

ErrorBoundaryFallback.displayName = "ErrorBoundaryFallback";

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a1a1a",
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#4a4a4a",
    lineHeight: 22,
  },
  errorDetails: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ErrorBoundaryFallback;
