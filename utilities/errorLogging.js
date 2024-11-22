export const logError = async (error, errorInfo) => {
  try {
    // Add your error logging service integration here
    // Example with custom analytics:
    if (__DEV__) {
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
    } else {
      // Send to production error tracking service
      // await Analytics.logError(error, errorInfo);
    }
  } catch (loggingError) {
    console.error("Error logging failed:", loggingError);
  }
};
