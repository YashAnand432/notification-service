import Notification from '../models/Notification.js';
import { sendNotification } from '../services/notificationService.js';

export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message } = req.body;
    
    const notification = new Notification({
      userId,
      type,
      title,
      message
    });
    
    await notification.save();
    await sendNotification(notification);
    
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};