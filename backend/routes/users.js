import express from 'express';
import { getUserNotifications } from '../controllers/userController.js';
import User from '../models/User.js';
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Message from '../models/Message.js';

dotenv.config();

const router = express.Router();

router.post('/get-user-id', async (req, res) => {
  try {
    const { email } = req.body;
    console.log("received email id to get user id" , email);
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      success: true,
      userId: user._id,
      email: user.email 
    });

  } catch (error) {
    console.error('Error fetching user ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user information' 
    });
  }
});

router.get('/test-email', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: 'anand.yash26432@gmail.com', // ← Change to your real email
      subject: 'Direct Test Email',
      text: 'This is a direct test'
    });

    console.log('Message sent: %s', info.messageId);
    res.send('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).send(error.toString());
  }
});

router.post('/', async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      preferences: {
        email: req.body.preferences?.email || true,
        sms: req.body.preferences?.sms || false,
        inApp: req.body.preferences?.inApp || true
      }
    });
    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      details: error.errors 
    });
  }
});

router.get('/:id/notifications', getUserNotifications);

router.post('/in-app', async (req, res) => {
  try {
    const { senderId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required in request body' });
    }
    
    const messages = await Message.find({
      receiver: userId,
      type: 'in-app'
    }).sort({ createdAt: -1 });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching in-app messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;