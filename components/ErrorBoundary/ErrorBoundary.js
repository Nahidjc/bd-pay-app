import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import ErrorBoundaryFallback from "./ErrorBoundaryFallback";
import { logError } from "../../utilities/errorLogging";

const ErrorBoundary = ({ children, fallback, onError }) => {
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const handleCatch = useCallback(
    (error, errorInfo) => {
      setError(error);
      setErrorInfo(errorInfo);
      logError(error, errorInfo);
      onError?.(error, errorInfo);
    },
    [onError]
  );

  const resetError = useCallback(() => {
    setError(null);
    setErrorInfo(null);
  }, []);

  if (error) {
    if (fallback) {
      return fallback({ error, resetError, errorInfo });
    }

    return (
      <ErrorBoundaryFallback
        error={error}
        errorInfo={errorInfo}
        resetError={resetError}
      />
    );
  }

  return (
    <React.Fragment>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              onError: handleCatch,
            })
          : child
      )}
    </React.Fragment>
  );
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onError: PropTypes.func,
};

export default ErrorBoundary;
