import React, { useState, useEffect } from 'react';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const ws = new WebSocket(`${protocol}//${host}/ws`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        setNotifications(prev => [data.data, ...prev.slice(0, 9)]);
      }
    };
    
    return () => ws.close();
  }, []);

  return (
    <div className="real-time-notifications">
      <h3>Real-Time Notifications</h3>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No real-time notifications</p>
      )}
    </div>
  );
};

export default NotificationComponent;