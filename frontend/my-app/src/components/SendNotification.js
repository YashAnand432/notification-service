import { useState, useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import apiClient from '../utils/apiClient';
import './SendNotification.css'; // Create this CSS file for styling

const SendNotification = () => {
  const [recipientId, setRecipientId] = useState('');
  const [content, setContent] = useState('');
  const [notificationType, setNotificationType] = useState('in-app');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { userId } = useContext(NotificationContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.post('/api/notifications', {
        senderId: userId,
        recipientId,
        content,
        type: notificationType,
        status: 'pending'
      });

      setSuccess('Notification sent successfully!');
      setRecipientId('');
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification');
      console.error('Notification error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="send-notification-container">
      <h2>Send Notification</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="recipientId">Recipient User ID:</label>
          <input
            id="recipientId"
            type="text"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            required
            placeholder="Enter recipient's user ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notificationType">Notification Type:</label>
          <select
            id="notificationType"
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
          >
            <option value="in-app">In-App Notification</option>
            <option value="email">Email Notification</option>
            <option value="sms">SMS Notification</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Message:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Enter your notification message"
            rows="5"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button 
          type="submit" 
          disabled={isSending}
          className="send-button"
        >
          {isSending ? (
            <>
              <span className="spinner"></span>
              Sending...
            </>
          ) : (
            'Send Notification'
          )}
        </button>
      </form>
    </div>
  );
};

export default SendNotification;