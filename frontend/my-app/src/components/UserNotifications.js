import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const UserNotifications = () => {
  const { id } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get(`/users/${id}/notifications`);
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [id]);
  
  if (loading) return <div className="loading">Loading...</div>;
  
  return (
    <div className="notifications-container">
      <h2>Notifications for User {id}</h2>
      {notifications.length === 0 ? (
        <p>No notifications found</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map(notification => (
            <li key={notification._id} className="notification-item">
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <div className="notification-meta">
                <span>Type: {notification.type}</span>
                <span>Status: {notification.status}</span>
                <span>{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserNotifications;