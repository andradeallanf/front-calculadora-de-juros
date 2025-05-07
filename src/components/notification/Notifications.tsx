import React from 'react';
import { useAppContext, Notification } from '../../context/AppContext';
import './Notifications.css';

const NotificationItem: React.FC<{ notification: Notification; onClose: () => void }> = ({
  notification,
  onClose,
}) => {
  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-content">
        <p>{notification.message}</p>
      </div>
      <button className="notification-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useAppContext();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default Notifications;
