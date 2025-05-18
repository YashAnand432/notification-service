import amqp from 'amqplib';
import Notification from '../models/Notification.js';
import { sendEmail, sendSMS, sendInApp } from './notificationProviders.js';

let channel;
const queueName = 'notifications';

async function connectToQueue() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    console.log('Connected to RabbitMQ');
    processMessages();
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    setTimeout(connectToQueue, 5000);
  }
}

async function processMessages() {
  channel.consume(queueName, async (msg) => {
    if (msg) {
      const notification = JSON.parse(msg.content.toString());
      
      try {
        switch (notification.type) {
          case 'email':
            await sendEmail(notification);
            break;
          case 'sms':
            await sendSMS(notification);
            break;
          case 'in-app':
            await sendInApp(notification);
            break;
        }
        
        await Notification.findByIdAndUpdate(notification._id, { status: 'sent' });
        channel.ack(msg);
      } catch (error) {
        console.error('Notification failed:', error);
        
        const updated = await Notification.findByIdAndUpdate(
          notification._id,
          { 
            $inc: { retryCount: 1 },
            status: notification.retryCount >= 2 ? 'failed' : 'pending'
          },
          { new: true }
        );
        
        if (updated.retryCount <= 2) {
          channel.nack(msg, false, true);
        } else {
          channel.ack(msg);
        }
      }
    }
  });
}

export async function sendNotification(notification) {
  if (!channel) await connectToQueue();
  
  channel.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify(notification)),
    { persistent: true }
  );
}