import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import courseRoutes from './routes/courses.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/sessions.js';
import learningRoutes from './routes/learning.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edupro';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/learning', learningRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EduPro API is running' });
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Starting server without DB (demo mode)...');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} (no DB)`);
    });
  });

export default app;
