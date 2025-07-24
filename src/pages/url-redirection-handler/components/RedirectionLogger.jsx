import React, { createContext, useContext, useCallback } from 'react';

const LoggerContext = createContext();

export const useLogger = () => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error('useLogger must be used within a LoggerProvider');
  }
  return context;
};

export const LoggerProvider = ({ children }) => {
  const logEvent = useCallback((eventType, data) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: sessionStorage.getItem('sessionId') || 'anonymous'
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 LinkShrinker Log:', logEntry);
    }

    // Store in localStorage for analytics
    const existingLogs = JSON.parse(localStorage.getItem('linkshrinker_logs') || '[]');
    existingLogs.push(logEntry);
    
    // Keep only last 100 logs to prevent storage overflow
    if (existingLogs.length > 100) {
      existingLogs.splice(0, existingLogs.length - 100);
    }
    
    localStorage.setItem('linkshrinker_logs', JSON.stringify(existingLogs));
  }, []);

  const logRedirectionAttempt = useCallback((shortCode, status, originalUrl = null, error = null) => {
    logEvent('redirection_attempt', {
      shortCode,
      status, // 'success', 'expired', 'invalid'
      originalUrl,
      error,
      timestamp: Date.now()
    });
  }, [logEvent]);

  const logRedirectionSuccess = useCallback((shortCode, originalUrl, redirectTime) => {
    logEvent('redirection_success', {
      shortCode,
      originalUrl,
      redirectTime,
      timestamp: Date.now()
    });
  }, [logEvent]);

  const logRedirectionError = useCallback((shortCode, errorType, errorMessage) => {
    logEvent('redirection_error', {
      shortCode,
      errorType, // 'expired', 'invalid', 'network'
      errorMessage,
      timestamp: Date.now()
    });
  }, [logEvent]);

  const value = {
    logEvent,
    logRedirectionAttempt,
    logRedirectionSuccess,
    logRedirectionError
  };

  return (
    <LoggerContext.Provider value={value}>
      {children}
    </LoggerContext.Provider>
  );
};

const RedirectionLogger = ({ children }) => {
  return (
    <LoggerProvider>
      {children}
    </LoggerProvider>
  );
};

export default RedirectionLogger;