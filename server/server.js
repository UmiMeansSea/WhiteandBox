import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { deleteCourse } from './controllers/courseController.js';
import { requireAdmin } from './middleware/auth.js';
import courseRoutes from './routes/courses.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/sessions.js';
import learningRoutes from './routes/learning.js';
import adminRoutes from './routes/admin.js';
import connectDB from './config/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edupro';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

// Middleware
app.use(cors({
  origin: CLIENT_URL === '*' ? true : CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// Debug Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/admin', adminRoutes);

// Emergency direct route
app.delete('/api/admin/courses/:id', requireAdmin, deleteCourse);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EduPro API is running' });
});

// ── Serve built React client (used when sharing via ngrok) ────────────────────
const clientBuild = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  // Catch-all: let React Router handle client-side navigation (Express 5 syntax)
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
  console.log('📦 Serving built React client from /client/dist');
}
// ─────────────────────────────────────────────────────────────────────────────

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

export default app;
