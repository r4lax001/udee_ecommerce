import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error('JWT_SECRET must be configured before starting the server');

/**
 * Middleware to require authentication via JWT.
 * Decrypts the token, checks user existence, and verifies if the user is suspended.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'ไม่พบบัญชีผู้ใช้งานในระบบ' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ success: false, message: 'บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ success: false, message: 'สิทธิ์การใช้งานหมดอายุหรือโทเค็นไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่อีกครั้ง' });
  }
};

/**
 * Middleware to restrict access to ADMIN users only.
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'สำหรับผู้ดูแลระบบเท่านั้น' });
  }
  next();
};
