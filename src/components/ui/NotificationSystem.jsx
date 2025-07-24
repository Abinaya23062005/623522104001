import React, { useState, useEffect, createContext, useContext } from 'react';
import Icon from '../AppIcon';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'success',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, options = {}) => {
    addNotification({
      type: 'success',
      message,
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    addNotification({
      type: 'error',
      message,
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    addNotification({
      type: 'warning',
      message,
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    addNotification({
      type: 'info',
      message,
      ...options,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-20 right-4 z-200 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(onRemove, 200);
  };

  const getNotificationStyles = () => {
    const baseStyles = "flex items-start space-x-3 p-4 rounded-lg shadow-medium border transition-progressive";
    
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-card border-success/20 text-foreground`;
      case 'error':
        return `${baseStyles} bg-card border-error/20 text-foreground`;
      case 'warning':
        return `${baseStyles} bg-card border-warning/20 text-foreground`;
      case 'info':
        return `${baseStyles} bg-card border-primary/20 text-foreground`;
      default:
        return `${baseStyles} bg-card border-border text-foreground`;
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return { name: 'CheckCircle', color: 'var(--color-success)' };
      case 'error':
        return { name: 'XCircle', color: 'var(--color-error)' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'var(--color-warning)' };
      case 'info':
        return { name: 'Info', color: 'var(--color-primary)' };
      default:
        return { name: 'Bell', color: 'var(--color-muted-foreground)' };
    }
  };

  const icon = getIcon();

  return (
    <div
      className={`${getNotificationStyles()} ${
        isVisible ? 'animate-slide-in opacity-100' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon name={icon.name} size={20} color={icon.color} />
      </div>
      
      <div className="flex-1 min-w-0">
        {notification.title && (
          <p className="text-sm font-medium text-foreground mb-1">
            {notification.title}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {notification.message}
        </p>
        {notification.action && (
          <div className="mt-2">
            <button
              onClick={notification.action.onClick}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
            >
              {notification.action.label}
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-smooth hover-scale"
      >
        <Icon name="X" size={16} />
      </button>
    </div>
  );
};

// Main NotificationSystem component that wraps NotificationProvider
const NotificationSystem = ({ children }) => {
  return <NotificationProvider>{children}</NotificationProvider>;
};

export default NotificationSystem;