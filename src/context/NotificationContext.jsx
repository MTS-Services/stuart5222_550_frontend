import { createContext, useContext, useState, useEffect } from 'react';
import { getUnreadNotificationsCount } from '../services/notificationService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      const response = await getUnreadNotificationsCount();
      setUnreadCount(response.count || response.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (count = 1) => {
    setUnreadCount(prev => Math.max(0, prev - count));
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const addNotification = () => {
    setUnreadCount(prev => prev + 1);
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    unreadCount,
    loading,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};