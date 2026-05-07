import crypto from 'crypto';

const isProd = process.env.NODE_ENV === 'production';

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  };
}

export function ensureSessionCookie(req, res, next) {
  const existing = req.cookies?.sid;
  if (existing) {
    req.sessionId = existing;
    return next();
  }
  const sid = crypto.randomUUID?.() || crypto.randomBytes(16).toString('hex');
  res.cookie('sid', sid, cookieOptions());
  req.sessionId = sid;
  return next();
}

