import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const NotificationBell = () => {
  const { notifications } = useContext(NotificationContext);

  return (
    <div className="notification-bell">
      🔔 {notifications.length > 0 && (
        <span className="badge">{notifications.length}</span>
      )}
      
      <div className="notification-dropdown">
        {notifications.map((n, i) => (
          <div key={i} className="notification-item">
            <strong>{n.title}</strong>
            <p>{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};