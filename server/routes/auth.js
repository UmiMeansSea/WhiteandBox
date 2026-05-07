import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const isProd = process.env.NODE_ENV === 'production';
const DEMO_USERS = [
  {
    id: 'demo-admin',
    name: 'Demo Admin',
    email: 'admin@edupro.demo',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    id: 'demo-student',
    name: 'Demo Student',
    email: 'student@edupro.demo',
    password: 'Student@123',
    role: 'student',
  },
];

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  };
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'instructor',
    });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, getCookieOptions());
    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const demoUser = DEMO_USERS.find((u) => u.email === normalizedEmail);
    if (demoUser && demoUser.password === password) {
      const token = jwt.sign(
        {
          id: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
          name: demoUser.name,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.cookie('token', token, getCookieOptions());
      return res.json({
        user: {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          avatar: null,
        },
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, getCookieOptions());
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
  });
  return res.json({ message: 'Logged out' });
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    if (String(req.user.id).startsWith('demo-')) {
      return res.json({
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          avatar: null,
        },
      });
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to fetch user' });
  }
});

export default router;

