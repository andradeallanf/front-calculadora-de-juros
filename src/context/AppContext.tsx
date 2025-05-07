import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Define the notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

// Define the context interface
interface AppContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string) => void;
  removeNotification: (id: string) => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  isLoading: false,
  setIsLoading: () => {},
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add a new notification
  const addNotification = (type: NotificationType, message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto-remove notifications after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  // Remove a notification by ID
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook for using the context
export const useAppContext = () => useContext(AppContext);
