import { createContext, useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [socket, setSocket] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('authToken');
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'notification') {
        setNotifications(prev => [message.data, ...prev.slice(0, 9)]);
      }
    };

    setSocket(ws);

    return () => ws.close();
  }, []);


  const login = (newToken, userId) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userId', userId);
    setToken(newToken);
    setUserId(userId);
    setIsAuthenticated(true);
 };
 
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
  };
   
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    setIsAuthenticated(!!storedToken);
    setToken(storedToken);
  }, []);



  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if(!token)  return;
   
    const socket = new WebSocket(
      `ws://localhost:3000/ws?token=${encodeURIComponent(token)}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        setNotifications(prev => [data.data, ...prev.slice(0, 9)]);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <NotificationContext.Provider value={{  notifications,
        isAuthenticated,
        token,
        login,
        logout,
        userId,
        sendNotification: async (recipientId, content) => {
    try {
      const response = await apiClient.post('/api/notifications', {
        recipientId,
        content,
        type: 'in-app'
      });
      return response.data;
    } catch (error) {
      console.error('Notification error:', error);
      throw error;
    }
  }
        }}>
      {children}
    </NotificationContext.Provider>
  );
};