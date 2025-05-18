import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import notificationRoutes from './routes/notifications.js';
import userRoutes from './routes/users.js';
import authRoutes from "./routes/authRoutes.js";
import jwt from "jsonwebtoken"
import cors from "cors";
import {WebSocketServer} from 'ws';
import ws from "ws";
import { initWebSocket } from './services/notificationProviders.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const server = createServer(app);

// Middleware
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true
}));

export const sendInAppNotification = (userId, message) => {
  const connections = activeConnections.get(userId) || [];
  connections.forEach(ws => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'notification',
        data: message
      }));
    }
  });
};

// API routes
app.use('/api',authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);


const wss = new WebSocketServer({ port : 8080 });
const activeConnections = new Map(); // userId → WebSocket[]

wss.on('connection', (ws, req) => {
  // Extract JWT from query params or cookies
  const token = new URL(req.url, 'http://dummy').searchParams.get('token');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Store connection
    if (!activeConnections.has(userId)) {
      activeConnections.set(userId, []);
    }
    activeConnections.get(userId).push(ws);

    // Clean up on close
    ws.on('close', () => {
      activeConnections.set(
        userId, 
        activeConnections.get(userId).filter(conn => conn !== ws)
      );
    });

  } catch (error) {
    ws.close(1008, 'Invalid token');
  }
});
// Initialize WebSocket
initWebSocket(server);

// Database connection
connectDB();

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});