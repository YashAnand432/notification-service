# **Notification Service Platform**  

## **Overview**  
A comprehensive notification system supporting multiple delivery channels with real-time capabilities, message queuing, and user management. Perfect for applications requiring reliable communication with users across different channels.

## **Features**  
- Real-time in-app notifications  
- Email notifications with templates  
- SMS notifications via Twilio  
- Message queuing with RabbitMQ  
- JWT authentication  
- Notification history tracking  

## **Technology Stack**  

### **Core Components**  
- **Frontend**: React.js with Context API  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB  
- **Real-time**: WebSocket  

### **Notification Services**  
| Service       | Purpose                          | Package Used |  
|---------------|----------------------------------|--------------|  
| **RabbitMQ**  | Message queue for notifications  | amqplib      |  
| **Twilio**    | SMS message delivery             | twilio       |  
| **Nodemailer**| Email delivery                   | nodemailer   |  

## **Screenshots** ##
('/notification-service/assets/sending notif.png)

## **🛠 Setup Instructions**

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (v5+)
- [RabbitMQ](https://www.rabbitmq.com/) (v3.8+)
- [Twilio Account](https://www.twilio.com/) (for SMS)
- SMTP Credentials (for email)

---

### **1. Backend Setup**
```bash
# Clone the repository
git clone https://github.com/yourusername/notification-service.git

# Navigate to server directory
cd notification-service/server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

Edit the .env with your credentials

# Server
PORT=8000
JWT_SECRET=your_secure_jwt_secret
MONGODB_URI=mongodb://localhost:27017/notification_db

# RabbitMQ
RABBITMQ_URL=amqp://localhost

# Twilio (for SMS)
TWILIO_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password


# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

Edit the .env file:

REACT_APP_API_BASE_URL=http://localhost:8000

 Running the Application

# Start backend (from /server directory)
npm run dev

# Start frontend (from /client directory)
npm start