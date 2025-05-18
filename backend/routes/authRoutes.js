import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
router.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const { email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const user = await User.findOne({ 
      $expr: { $eq: [{ $toLower: "$email" }, normalizedEmail] }
    });

    if (!user) {
      console.log('Creating new user');
      const newUser = await User.create({ email: normalizedEmail });
      
      const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({
        success: true,
        token,
        userId: newUser._id,
        email: newUser.email
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      userId: user._id,
      email: user.email
    });

  } catch (error) {
    console.error('Full error stack:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;