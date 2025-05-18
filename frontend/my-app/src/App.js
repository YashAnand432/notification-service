import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { NotificationContext, NotificationProvider } from './contexts/NotificationContext';
import SendNotification from './components/SendNotification';
import UserNotifications from './components/UserNotifications';
import NotificationComponent from './components/NotificationComponent';
import Login from "./pages/Login.js";
import './App.css';
import Home from './pages/Home.js';

// Create a wrapper component that can use hooks
function AppContent() {
  const { isAuthenticated , logout } = useContext(NotificationContext);
  const {userId} = useContext(NotificationContext);
  
  useEffect(() => {
  console.log('LocalStorage userId:', localStorage.getItem('userId'));
}, [userId]);
  
return (
    <div className="app-container">
      {isAuthenticated && (
        <nav className="app-nav">
          <ul>
            <li><Link to="/send">Send Notification</Link></li>
            <li><Link to="/user/notifications">View Notifications</Link></li>
            <li>
              <span className="user-info text-white">User ID: {userId} </span>
              <button onClick={logout}>Logout</button>
            </li>
            
          </ul>
        </nav>
      )}
      
      {/* <NotificationComponent /> */}
      
      <div className="app-content">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/send" />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/send" element={isAuthenticated ? <SendNotification /> : <Navigate to="/login" />} />
          <Route path="/user/notifications" element={isAuthenticated ? <UserNotifications /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/send" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </Router>
  );
}

export default App;
