import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { WebSocketServer } from 'ws';
import User from '../models/User.js';
import Message from "../models/Message.js";
import dotenv from "dotenv";
dotenv.config();
// Email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  },
  logger: true,  // Enable logging
  debug: true    // Show debug output
});

// SMS
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// WebSocket
let wss;

export function initWebSocket(server) {
  wss = new WebSocketServer({ server, path: '/ws' });
  console.log('WebSocket server started');
}

export async function sendEmail(notification) {
  try {
    const user = await User.findById(notification.userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    console.log(`Sending email to: ${user.email}`);
    console.log(`Using auth: ${process.env.EMAIL_USER}`);

    const mailOptions = {
      from: `"Notif Service" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: notification.title,
      text: notification.message,
      html: `<p>${notification.message}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

export async function sendSMS(notification) {
  const user = await User.findById(notification.userId);
  if (!user.phone) throw new Error('User has no phone number');
  
  await twilioClient.messages.create({
    body: `${notification.title}: ${notification.message}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: user.phone
  });
}

export async function sendInApp(notification) {
  try {
    // Create a new message in the database
    const newMessage = new Message({
      title: notification.title,
      message: notification.message,
      sender: notification.senderId, // Use system ID if no sender
      receiver: notification.userId,
      createdAt: new Date()
    });
    
    // Save the message to the database
    await newMessage.save();
    console.log(`In-app message saved to database with ID: ${newMessage._id}`);
    
    return newMessage;
  } catch (error) {
    console.error('Error saving in-app message:', error);
    throw error;
  }
}